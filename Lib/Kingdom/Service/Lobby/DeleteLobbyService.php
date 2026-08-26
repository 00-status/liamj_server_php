<?php

namespace Lib\Kingdom\Service\Lobby;

use DomainException;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Service\DTO\KingdomPlayerDTO;

class DeleteLobbyService
{
    public function __construct(
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
    ) {}

    /**
     * Returns all players within a given lobby.
     * @param string $lobby_code
     * @throws DomainException
     * @return KingdomPlayerDTO[]
     */
    public function deleteLobby(string $lobby_code): void
    {
        if (!$lobby_code) {
            throw new DomainException("Invalid lobby code!", 400);
        }

        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);

        if (!$lobby) {
            return;
        }

        $this->lobby_db->deleteRows([$lobby->id]);

        return;
    }
}
