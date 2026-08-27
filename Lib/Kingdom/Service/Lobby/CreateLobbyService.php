<?php

namespace Lib\Kingdom\Service\Lobby;

use Lib\Kingdom\Domain\Entity\Lobby;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;

class CreateLobbyService
{
    private const MAXIMUM_LOBBY_COUNT = 5;

    public function __construct(
        private LobbyDbContext $lobby_db,
    ) {}

    public function createLobby(): Lobby
    {
        // Cull expired lobbies
        $expired_lobbies = $this->lobby_db->fetchExpiredLobbies();
        $this->lobby_db->deleteRows(array_map(fn(Lobby $lobby) => $lobby->id, $expired_lobbies));

        $active_count = $this->lobby_db->countActiveLobbies();
        if ($active_count >= self::MAXIMUM_LOBBY_COUNT) {
            throw new \DomainException("Cannot create lobby at this time.", 403);
        }

        $lobby_code = $this->generateUniqueLobbyCode();

        $now = new \DateTimeImmutable();
        $created_string = $now->format('Y-m-d H:i:s');
        $time_to_die = $now->modify('+3 hours')->format('Y-m-d H:i:s');

        $lobby = Lobby::fromArray([
            'lobby_code' => $lobby_code,
            'time_to_die' => $time_to_die,
            'created' => $created_string,
        ]);

        $id = $this->lobby_db->insertLobby($lobby);

        return Lobby::fromArray([
            'id' => $id,
            'lobby_code' => $lobby_code,
            'time_to_die' => $time_to_die,
            'created' => $created_string,
        ]);
    }

    private function generateUniqueLobbyCode(): string
    {
        $alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
        for ($i = 0; $i < 100; $i++) {
            $lobby_code = (new \Random\Randomizer())->getBytesFromString($alphabet, 5);

            if ($this->lobby_db->fetchLobbyByCode($lobby_code) === null) {
                return $lobby_code;
            }
        }

        throw new \RuntimeException("Unable to generate a unique lobby code.", 500);
    }
}
