<?php

namespace Lib\Kingdom\Service\RegionTemplate;

use Lib\Kingdom\Domain\Entity\RegionTemplate;
use Lib\Kingdom\Domain\Entity\TileTemplate;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class CreateRegionTemplateService
{
    public function __construct(
        private RegionTemplateDbContext $template_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    public function createRegionTemplate(RegionTemplate $template): RegionTemplate
    {
        // 1. Insert template and retrieve ID
        $template_id = $this->template_db->insertRegionTemplate($template);

        // 2. Insert child tile templates
        $saved_tile_templates = [];
        foreach ($template->tile_templates as $tile_template) {
            $new_tile_template = TileTemplate::fromArray([
                'region_template_id' => $template_id,
                'x' => $tile_template->x,
                'y' => $tile_template->y,
                'type' => $tile_template->type,
            ]);

            $this->tile_template_db->insertTileTemplate($new_tile_template);
            $saved_tile_templates[] = $new_tile_template;
        }

        // 3. Return the fully saved template
        return RegionTemplate::fromArray([
            'id' => $template_id,
            'name' => $template->name,
        ], $saved_tile_templates);
    }
}
