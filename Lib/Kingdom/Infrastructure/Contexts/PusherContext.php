<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use Pusher\Pusher;

class PusherContext
{
    public function __construct(
        private ?Pusher $pusher = null,
    ) {}

    public function broadcastLobbyUpdated(int $lobby_code, array $players): void
    {
        if ($this->pusher === null) {
            return;
        }

        try {
            $this->pusher->trigger("private-lobby-{$lobby_code}", "lobby-updated", [
                'lobby_code' => $lobby_code,
                'players' => $players,
            ]);
        } catch (\Throwable $e) {
            // Ignore Pusher errors in local/testing
        }
    }

    public function broadcastKingdomGenerated(int $lobby_code, int $kingdom_id): void
    {
        if ($this->pusher === null) {
            return;
        }

        try {
            $this->pusher->trigger("private-lobby-{$lobby_code}", "kingdom-generated", [
                'kingdom_id' => $kingdom_id,
            ]);
        } catch (\Throwable $e) {
            // Ignore Pusher errors in local/testing
        }
    }

    public function authorizeChannel(string $channel_name, string $socket_id): array
    {
        if ($this->pusher === null) {
            return [
                'auth' => 'dummy_key:dummy_signature',
            ];
        }

        try {
            $auth_str = $this->pusher->authorizeChannel($channel_name, $socket_id);
            return json_decode($auth_str, true) ?? [];
        } catch (\Throwable $e) {
            return [
                'auth' => 'dummy_key:dummy_signature',
            ];
        }
    }
}
