<?php

namespace Lib\Kingdom\Service\Lobby;

use Lib\Kingdom\Domain\Entity\Lobby;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;

class CreateLobbyService
{
    public function __construct(
        private LobbyDbContext $lobby_db,
    ) {}

    public function createLobby(): Lobby
    {
        // 1. Cull expired lobbies
        $expired_lobbies = $this->lobby_db->fetchExpiredLobbies();
        $this->lobby_db->deleteRows(array_map(fn(Lobby $lobby) => $lobby->id, $expired_lobbies));

        // 2. Enforce active lobby capacity (max 2)
        $active_count = $this->lobby_db->countActiveLobbies();
        if ($active_count >= 2) {
            throw new \DomainException("Cannot create lobby at this time.", 403);
        }

        // 3. Generate a unique 6-digit lobby code
        $lobby_code = $this->generateUniqueLobbyCode();

        // 4. Set created and time_to_die (created = NOW, time_to_die = NOW + 3 hours)
        $now = new \DateTime();
        $created_str = $now->format('Y-m-d H:i:s');
        $time_to_die = (clone $now)->modify('+3 hours')->format('Y-m-d H:i:s');

        $lobby = Lobby::fromArray([
            'lobby_code' => $lobby_code,
            'time_to_die' => $time_to_die,
            'created' => $created_str,
        ]);

        $id = $this->lobby_db->insertLobby($lobby);

        return Lobby::fromArray([
            'id' => $id,
            'lobby_code' => $lobby_code,
            'time_to_die' => $time_to_die,
            'created' => $created_str,
        ]);
    }

    private function generateUniqueLobbyCode(): int
    {
        for ($i = 0; $i < 100; $i++) {
            $code = random_int(100000, 999999);
            $existing = $this->lobby_db->fetchLobbyByCode($code);
            if ($existing === null) {
                return $code;
            }
        }
        throw new \RuntimeException("Unable to generate a unique lobby code.", 500);
    }
}
