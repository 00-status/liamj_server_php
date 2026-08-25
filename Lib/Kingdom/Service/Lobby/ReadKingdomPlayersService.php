<?php

namespace Lib\Kingdom\Service\Lobby;

use DomainException;
use Lib\Kingdom\Domain\Entity\KingdomPlayer;
use Lib\Kingdom\Domain\Entity\KingdomPlayerDTO;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;

class ReadKingdomPlayersService
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
    public function readPlayers(string $lobby_code): array
    {
        if (!$lobby_code) {
            throw new DomainException("Invalid lobby code!", 400);
        }

        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);

        if (!$lobby) {
            throw new DomainException("Lobby not found!", 404);
        }

        $players = $this->player_db->fetchPlayersInLobby($lobby->id);

        return array_map(
            fn(KingdomPlayer $player) => new KingdomPlayerDTO(
                $player->id,
                $player->name,
                $player->is_leader
            ),
            $players
        );
    }
}
