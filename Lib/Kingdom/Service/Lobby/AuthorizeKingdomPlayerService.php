<?php

namespace Lib\Kingdom\Service\Lobby;

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

    public function authorizePlayer(string $authz_token, int $lobby_code, string $channel_name, string $socket_id): array
    {
        // 1. Cull expired lobbies first
        $this->lobby_db->cullExpiredLobbies();

        // 2. Fetch player by authz_token
        $player = $this->player_db->fetchPlayerByToken($authz_token);
        if ($player === null) {
            throw new \DomainException("Unauthorized player.", 403);
        }

        // 3. Fetch lobby by code
        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);
        if ($lobby === null) {
            throw new \DomainException("Lobby not found or expired.", 404);
        }

        // 4. Verify player belongs to this lobby
        if ($player->lobby_id !== $lobby->id) {
            throw new \DomainException("Player does not belong to this lobby.", 403);
        }

        // 5. Update lobby's time_to_die (extend lifetime by 3 hours)
        $this->lobby_db->updateTimeToDie($lobby->id);

        // 6. Sign and authorize with Pusher via PusherContext
        return $this->pusher_context->authorizeChannel($channel_name, $socket_id);
    }
}
