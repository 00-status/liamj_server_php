<?php

namespace Lib\Kingdom\Service\Kingdom;

use Lib\Kingdom\Domain\Entity\Kingdom;
use Lib\Kingdom\Domain\Entity\KingdomGenerationConfig;
use Lib\Kingdom\Domain\Entity\Region;
use Lib\Kingdom\Domain\Entity\Tile;
use Lib\Kingdom\Domain\KingdomGenerator;
use Lib\Kingdom\Infrastructure\Contexts\KingdomDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\LobbyDbContext;
use Lib\Kingdom\Infrastructure\Contexts\KingdomPlayerDbContext;
use Lib\Kingdom\Infrastructure\Contexts\PusherContext;
use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;

class GenerateKingdomService
{
    public function __construct(
        private KingdomDbContext $kingdom_db,
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private ReadRegionTemplatesService $read_templates_service,
        private KingdomGenerator $generator,
        private LobbyDbContext $lobby_db,
        private KingdomPlayerDbContext $player_db,
        private PusherContext $pusher_context,
    ) {}

    public function generateKingdom(KingdomGenerationConfig $config, ?int $lobby_id = null, ?string $authz_token = null): Kingdom
    {
        if ($lobby_id !== null) {
            if ($authz_token === null) {
                throw new \DomainException("Authorization token is required to generate a kingdom from a lobby.", 401);
            }

            // Verify player
            $player = $this->player_db->fetchPlayerByToken($authz_token);
            if ($player === null) {
                throw new \DomainException("Unauthorized player.", 403);
            }

            // Verify lobby
            $lobby = $this->lobby_db->fetchLobbyById($lobby_id);
            if ($lobby === null) {
                throw new \DomainException("Lobby not found.", 404);
            }

            // Verify player belongs to lobby
            if ($player->lobby_id !== $lobby->id) {
                throw new \DomainException("Player does not belong to this lobby.", 403);
            }

            // Verify leader
            if (!$player->is_leader) {
                throw new \DomainException("Only the Lobby Leader can generate a kingdom.", 403);
            }

            // Verify at least 2 players have joined
            $players = $this->player_db->fetchPlayersInLobby($lobby->id);
            if (count($players) < 2) {
                throw new \DomainException("At least two players must join the lobby before generating a kingdom.", 400);
            }

            // Verify only one Kingdom can be generated per lobby
            $existing = $this->kingdom_db->fetchKingdomByLobbyId($lobby->id);
            if ($existing !== null) {
                throw new \DomainException("A kingdom has already been generated for this lobby.", 409);
            }
        }

        $templates = $this->read_templates_service->readRegionTemplates();
        if (empty($templates)) {
            throw new \DomainException("Cannot generate a kingdom because no RegionTemplates exist in the database.", 400);
        }

        $generated_kingdom = $this->generator->generate($config, $templates);

        $pdo = $this->kingdom_db->getPdo();
        $pdo->beginTransaction();

        try {
            $kingdom_to_insert = Kingdom::fromArray([
                'name' => $generated_kingdom->name,
                'grid_width' => $generated_kingdom->grid_width,
                'grid_height' => $generated_kingdom->grid_height,
                'lobby_id' => $lobby_id,
            ]);
            $kingdom_id = $this->kingdom_db->insertKingdom($kingdom_to_insert);

            $saved_regions = [];
            foreach ($generated_kingdom->regions as $region) {
                $region_to_insert = Region::fromArray([
                    'kingdom_id' => $kingdom_id,
                    'region_template_id' => $region->region_template_id,
                    'name' => $region->name,
                    'origin_x' => $region->origin_x,
                    'origin_y' => $region->origin_y,
                ]);
                $region_id = $this->region_db->insertRegion($region_to_insert);

                $tiles_to_insert = array_map(function (Tile $tile) use ($region_id) {
                    return Tile::fromArray([
                        'region_id' => $region_id,
                        'x' => $tile->x,
                        'y' => $tile->y,
                        'type' => $tile->type,
                    ]);
                }, $region->tiles);

                $this->tile_db->insertTiles($tiles_to_insert);

                $saved_regions[] = Region::fromArray([
                    'id' => $region_id,
                    'kingdom_id' => $kingdom_id,
                    'region_template_id' => $region->region_template_id,
                    'name' => $region->name,
                    'origin_x' => $region->origin_x,
                    'origin_y' => $region->origin_y,
                ], $region->region_template, $tiles_to_insert);
            }

            $pdo->commit();

            if ($lobby_id !== null && isset($lobby)) {
                $this->pusher_context->broadcastKingdomGenerated($lobby->lobby_code, $kingdom_id);
            }

            return Kingdom::fromArray([
                'id' => $kingdom_id,
                'name' => $generated_kingdom->name,
                'grid_width' => $generated_kingdom->grid_width,
                'grid_height' => $generated_kingdom->grid_height,
                'lobby_id' => $lobby_id,
            ], $saved_regions);

        } catch (\Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            throw $exception;
        }
    }
}
