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
use Lib\Kingdom\Service\RegionTemplate\ReadRegionTemplatesService;

class GenerateKingdomService
{
    public function __construct(
        private KingdomDbContext $kingdom_db,
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private ReadRegionTemplatesService $read_templates_service,
        private KingdomGenerator $generator,
    ) {}

    public function generateKingdom(KingdomGenerationConfig $config): Kingdom
    {
        $templates = $this->read_templates_service->readRegionTemplates();
        if (empty($templates)) {
            throw new \DomainException("Cannot generate a kingdom because no RegionTemplates exist in the database.", 400);
        }

        $generated_kingdom = $this->generator->generate($config, $templates);

        $pdo = $this->kingdom_db->getPdo();
        $pdo->beginTransaction();

        try {
            $kingdom_id = $this->kingdom_db->insertKingdom($generated_kingdom);

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

            return Kingdom::fromArray([
                'id' => $kingdom_id,
                'name' => $generated_kingdom->name,
                'grid_width' => $generated_kingdom->grid_width,
                'grid_height' => $generated_kingdom->grid_width,
            ], $saved_regions);

        } catch (\Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }

            throw $exception;
        }
    }
}
