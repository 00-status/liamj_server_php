<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use Pusher\Pusher;

class PusherContext
{
    public function __construct(
        private Pusher $pusher,
    ) {}

    public function broadcastLobbyUpdated(int $lobby_code, array $players): void
    {
        $this->pusher->trigger("private-lobby-{$lobby_code}", "lobby-updated", [
            'lobby_code' => $lobby_code,
            'players' => $players,
        ]);
    }

    public function broadcastKingdomGenerated(int $lobby_code, int $kingdom_id): void
    {
        $this->pusher->trigger("private-lobby-{$lobby_code}", "kingdom-generated", [
            'kingdom_id' => $kingdom_id,
        ]);
    }

    public function authorizeChannel(string $channel_name, string $socket_id): array
    {
        $auth_str = $this->pusher->authorizeChannel($channel_name, $socket_id);
        return json_decode($auth_str, true) ?? [];
    }
}
