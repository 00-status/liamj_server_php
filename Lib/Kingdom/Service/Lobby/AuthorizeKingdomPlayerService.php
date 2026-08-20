<?php

namespace Lib\Kingdom\Service\Lobby;

use DateTimeImmutable;
use Lib\Kingdom\Domain\Entity\Lobby;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\PusherContext;

class AuthorizeKingdomPlayerService
{
    public function __construct(
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
        private PusherContext $pusher_context,
    ) {}

    public function authorizePlayer(string $authz_token, string $lobby_code, string $channel_name, string $socket_id): array
    {
        // Cull expired lobbies
        $expired_lobbies = $this->lobby_db->fetchExpiredLobbies();
        $this->lobby_db->deleteRows(array_map(fn(Lobby $lobby) => $lobby->id, $expired_lobbies));

        $player = $this->player_db->fetchPlayerByToken($authz_token);
        if ($player === null) {
            throw new \DomainException("Unauthorized player.", 403);
        }

        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);
        if ($lobby === null) {
            throw new \DomainException("Lobby not found or expired.", 404);
        }

        if ($player->lobby_id !== $lobby->id) {
            throw new \DomainException("Player does not belong to this lobby.", 403);
        }

        // Update lobby's time_to_die (extend lifetime by 3 hours)
        $expired_time = new DateTimeImmutable()->modify("+3 hours")->format(DateTimeImmutable::ATOM);
        $updated_column = ["time_to_die" => $expired_time];
        $this->lobby_db->updateColumn($lobby->id, $updated_column);

        // Sign and authorize with Pusher via PusherContext
        return $this->pusher_context->authorizeChannel($channel_name, $socket_id);
    }
}
