<?php

namespace Lib\Kingdom\Service\Lobby;

use Lib\Kingdom\Domain\Entity\KingdomPlayer;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\PusherContext;

class CreateKingdomPlayerService
{
    public function __construct(
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
        private PusherContext $pusher_context,
    ) {}

    public function createPlayer(int $lobby_code, ?string $player_name): KingdomPlayer
    {
        // 1. Fetch lobby
        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);
        if ($lobby === null) {
            throw new \DomainException("Lobby not found.", 404);
        }

        // 2. Fetch existing players in lobby
        $players = $this->player_db->fetchPlayersInLobby($lobby->id);
        if (count($players) >= 6) {
            throw new \DomainException("Lobby is full (maximum 6 players).", 409);
        }

        // 3. Assign color-based name
        $allowed_colors = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
        $taken_names = array_map(fn($p) => strtolower($p->name), $players);

        $selected_name = null;
        if (!empty($player_name)) {
            $selected_name = ucfirst(strtolower(trim($player_name)));
            if (in_array(strtolower($selected_name), $taken_names, true)) {
                throw new \DomainException("The player name '{$selected_name}' is already taken in this lobby.", 409);
            }
        } else {
            // Automatically assign the first free color
            foreach ($allowed_colors as $color) {
                if (!in_array(strtolower($color), $taken_names, true)) {
                    $selected_name = $color;
                    break;
                }
            }
            if ($selected_name === null) {
                throw new \DomainException("No available color names for this lobby.", 409);
            }
        }

        // 4. Determine if leader (first player to join is leader)
        $is_leader = (count($players) === 0);

        // 5. Generate a unique authorization token
        $authz_token = bin2hex(random_bytes(16));

        // 6. Save player
        $player = KingdomPlayer::fromArray([
            'lobby_id' => $lobby->id,
            'name' => $selected_name,
            'is_leader' => $is_leader,
            'authorization_token' => $authz_token,
        ]);

        $id = $this->player_db->insertKingdomPlayer($player);

        $new_player = KingdomPlayer::fromArray([
            'id' => $id,
            'lobby_id' => $lobby->id,
            'name' => $selected_name,
            'is_leader' => $is_leader,
            'authorization_token' => $authz_token,
        ]);

        // 7. Update lobby's time_to_die (extend lifetime by 3 hours)
        $this->lobby_db->updateTimeToDie($lobby->id);

        // 8. Broadcast update to other players in the lobby via PusherContext
        $all_players = array_merge($players, [$new_player]);
        $player_list = array_map(fn($p) => [
            'id' => $p->id,
            'name' => $p->name,
            'is_leader' => $p->is_leader,
        ], $all_players);

        $this->pusher_context->broadcastLobbyUpdated($lobby_code, $player_list);

        return $new_player;
    }
}
