<?php

namespace Lib\Kingdom\Service\Region;

use Lib\Kingdom\Domain\Region;
use Lib\Kingdom\Domain\Tile;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class CreateRegionService
{
    public function __construct(
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    public function createRegion(Region $region): Region
    {
        // 1. Insert Region metadata to DB and get generated ID
        $region_id = $this->region_db->insertRegion($region);

        $tiles = [];
        // 2. Apply Coordinate Offset strategy if region_template_id is provided
        if ($region->region_template_id !== null) {
            $tile_templates = $this->tile_template_db->fetchTileTemplates($region->region_template_id);

            foreach ($tile_templates as $tile_template) {
                // Coordinate offset calculation
                $offset_x = $tile_template->x + $region->origin_x;
                $offset_y = $tile_template->y + $region->origin_y;

                $new_tile = Tile::fromArray([
                    'region_id' => $region_id,
                    'x' => $offset_x,
                    'y' => $offset_y,
                    'type' => $tile_template->type,
                ]);

                $this->tile_db->insertTile($new_tile);
                $tiles[] = $new_tile;
            }
        }

        // 3. Return the fully instantiated Region with generated ID and calculated tiles
        return Region::fromArray([
            'id' => $region_id,
            'kingdom_id' => $region->kingdom_id,
            'region_template_id' => $region->region_template_id,
            'name' => $region->name,
            'origin_x' => $region->origin_x,
            'origin_y' => $region->origin_y,
        ], $region->region_template, $tiles);
    }
}
