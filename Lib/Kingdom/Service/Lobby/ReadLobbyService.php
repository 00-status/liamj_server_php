<?php

namespace Lib\Kingdom\Service\Lobby;

use Lib\Kingdom\Domain\Entity\Lobby;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;

class ReadLobbyService
{
    public function __construct(
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
    ) {}

    public function readLobbyByCode(string $lobby_code): Lobby
    {
        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);
        if ($lobby === null) {
            throw new \DomainException("Lobby not found.", 404);
        }

        $players = $this->player_db->fetchPlayersInLobby($lobby->id);

        return Lobby::fromArray([
            'id' => $lobby->id,
            'lobby_code' => $lobby->lobby_code,
            'time_to_die' => $lobby->time_to_die,
            'created' => $lobby->created,
        ], $players);
    }
}
