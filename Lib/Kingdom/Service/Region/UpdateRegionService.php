<?php

namespace Lib\Kingdom\Service\Region;

use Lib\Kingdom\Domain\Region;
use Lib\Kingdom\Domain\Tile;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class UpdateRegionService
{
    public function __construct(
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    public function updateRegion(Region $region): bool
    {
        // 1. Fetch old region details to check if origin or template has changed
        $old_region = $this->region_db->fetchRegion($region->id);
        if (!$old_region) {
            return false;
        }

        // 2. Update Region metadata in the DB
        $success = $this->region_db->updateRegion($region);
        if (!$success) {
            return false;
        }

        // 3. Re-calculate tiles if origin or template changed, or always sync them
        if ($old_region->origin_x !== $region->origin_x || 
            $old_region->origin_y !== $region->origin_y || 
            $old_region->region_template_id !== $region->region_template_id) {

            // Delete old tiles
            $this->tile_db->deleteTilesByRegion($region->id);

            // Recreate offset tiles if region_template_id is provided
            if ($region->region_template_id !== null) {
                $tile_templates = $this->tile_template_db->fetchTileTemplates($region->region_template_id);
                foreach ($tile_templates as $tile_template) {
                    $offset_x = $tile_template->x + $region->origin_x;
                    $offset_y = $tile_template->y + $region->origin_y;

                    $new_tile = Tile::fromArray([
                        'region_id' => $region->id,
                        'x' => $offset_x,
                        'y' => $offset_y,
                        'type' => $tile_template->type,
                    ]);

                    $this->tile_db->insertTile($new_tile);
                }
            }
        }

        return true;
    }
}
