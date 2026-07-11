<?php

namespace Lib\Kingdom\Service\Region;

use Lib\Kingdom\Domain\Region;
use Lib\Kingdom\Domain\RegionTemplate;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class ReadRegionsService
{
    public function __construct(
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private RegionTemplateDbContext $template_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    /**
     * @return Region[]
     */
    public function readRegions(int $kingdom_id): array
    {
        $regions = $this->region_db->fetchRegions($kingdom_id);

        $assembled_regions = [];
        foreach ($regions as $region) {
            $template = null;
            if ($region->region_template_id !== null) {
                $template_obj = $this->template_db->fetchRegionTemplate($region->region_template_id);
                if ($template_obj) {
                    $tile_templates = $this->tile_template_db->fetchTileTemplates($region->region_template_id);
                    $template = RegionTemplate::fromArray([
                        'id' => $template_obj->id,
                        'name' => $template_obj->name,
                    ], $tile_templates);
                }
            }

            $tiles = $this->tile_db->fetchTiles($region->id);

            $assembled_regions[] = Region::fromArray([
                'id' => $region->id,
                'kingdom_id' => $region->kingdom_id,
                'region_template_id' => $region->region_template_id,
                'name' => $region->name,
                'origin_x' => $region->origin_x,
                'origin_y' => $region->origin_y,
            ], $template, $tiles);
        }

        return $assembled_regions;
    }
}
