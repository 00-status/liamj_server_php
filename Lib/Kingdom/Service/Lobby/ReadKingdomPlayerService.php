<?php

namespace Lib\Kingdom\Service\Lobby;

use Lib\Kingdom\Domain\Entity\KingdomPlayer;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;

class ReadKingdomPlayerService
{
    public function __construct(
        private KingdomPlayerDbContext $player_db,
    ) {}

    public function readPlayerByToken(string $authz_token): KingdomPlayer
    {
        $player = $this->player_db->fetchPlayerByToken($authz_token);
        if ($player === null) {
            throw new \DomainException("Player not found with the given authorization token.", 404);
        }

        return $player;
    }
}
