<?php

namespace Lib\Kingdom\Service\Kingdom;

use Lib\Kingdom\Domain\Entity\Kingdom;
use Lib\Kingdom\Domain\Entity\Region;
use Lib\Kingdom\Domain\Entity\RegionTemplate;
use Lib\Kingdom\Infrastructure\Contexts\KingdomDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileDbContext;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class ReadKingdomService
{
    public function __construct(
        private KingdomDbContext $kingdom_db,
        private RegionDbContext $region_db,
        private TileDbContext $tile_db,
        private RegionTemplateDbContext $template_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    public function readKingdom(int $id): Kingdom
    {
        $kingdom = $this->kingdom_db->fetchKingdom($id);
        $regions = $this->region_db->fetchRegions($kingdom->id);

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

        $assembled_kingdom = Kingdom::fromArray([
            'id' => $kingdom->id,
            'name' => $kingdom->name,
            'grid_width' => $kingdom->grid_width,
            'grid_height' => $kingdom->grid_height,
            'lobby_id' => $kingdom->lobby_id,
        ], $assembled_regions);
        return $assembled_kingdom;
    }
}