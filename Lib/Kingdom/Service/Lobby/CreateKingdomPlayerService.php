<?php

namespace Lib\Kingdom\Service\Lobby;

use DateTimeImmutable;
use Lib\Kingdom\Domain\Entity\KingdomPlayer;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\PusherContext;
use Lib\Kingdom\Service\DTO\KingdomPlayerDTO;

class CreateKingdomPlayerService
{
    private const MAXIMUM_PLAYER_COUNT = 6;

    public function __construct(
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
        private PusherContext $pusher_context,
    ) {}

    public function createPlayer(string $lobby_code, string $player_name): KingdomPlayer
    {
        $lobby = $this->lobby_db->fetchLobbyByCode($lobby_code);
        if ($lobby === null) {
            throw new \DomainException("Lobby not found.", 404);
        }

        $players = $this->player_db->fetchPlayersInLobby($lobby->id);
        if (count($players) >= self::MAXIMUM_PLAYER_COUNT) {
            throw new \DomainException("Lobby is full (maximum 6 players).", 409);
        }

        $taken_names = array_map(fn($player) => strtolower($player->name), $players);
        $selected_name = $this->generateColorName($taken_names, $player_name);

        $is_lobby_leader = (count($players) === 0);

        // Generate a unique authorization token
        $authz_token = bin2hex(random_bytes(16));

        $player = KingdomPlayer::fromArray([
            'lobby_id' => $lobby->id,
            'name' => $selected_name,
            'is_leader' => $is_lobby_leader,
            'authorization_token' => $authz_token,
        ]);
        $id = $this->player_db->insertKingdomPlayer($player);

        $new_player = KingdomPlayer::fromArray([
            'id' => $id,
            'lobby_id' => $lobby->id,
            'name' => $selected_name,
            'is_leader' => $is_lobby_leader,
            'authorization_token' => $authz_token,
        ]);

        // Update lobby's time_to_die
        $expired_time = new DateTimeImmutable()->modify("+3 hours")->format(DateTimeImmutable::ATOM);
        $column_to_update = ["time_to_die" => $expired_time];
        $this->lobby_db->updateColumn($lobby->id, $column_to_update);

        // Broadcast update to other players in the lobby via PusherContext
        $all_players = array_merge($players, [$new_player]);
        $player_list = array_map(fn($player) => new KingdomPlayerDTO(
            $player->id,
            $player->name,
            $player->is_leader,
        ), $all_players);

        $this->pusher_context->broadcastLobbyUpdated($lobby_code, $player_list);

        return $new_player;
    }

    /**
     * 
     * @param string[] $taken_names
     * @throws \DomainException
     * @return string
     */
    private function generateColorName(array $taken_names, string $player_name): string
    {
        $allowed_colors = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];

        if (!empty($player_name)) {
            $selected_name = ucfirst(strtolower(trim($player_name)));
            if (in_array(strtolower($selected_name), $taken_names, true)) {
                throw new \DomainException("The player name '{$selected_name}' is already taken in this lobby.", 409);
            }

            return $selected_name;
        }

        // Automatically assign the first free color
        foreach ($allowed_colors as $color) {
            if (!in_array(strtolower($color), $taken_names, true)) {
                return $color;
            }
        }

        throw new \DomainException("No available color names for this lobby.", 409);
    }
}
