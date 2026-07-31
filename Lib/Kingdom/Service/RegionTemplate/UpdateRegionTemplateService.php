<?php

namespace Lib\Kingdom\Service\RegionTemplate;

use Lib\Kingdom\Domain\Entity\RegionTemplate;
use Lib\Kingdom\Domain\Entity\TileTemplate;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class UpdateRegionTemplateService
{
    public function __construct(
        private RegionTemplateDbContext $template_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    public function updateRegionTemplate(RegionTemplate $template): bool
    {
        // 1. Update the template metadata
        $success = $this->template_db->updateRegionTemplate($template);
        if (!$success) {
            return false;
        }

        // 2. Delete existing tile templates
        $this->tile_template_db->deleteTileTemplatesByRegionTemplate($template->id);

        // 3. Insert new tile templates
        foreach ($template->tile_templates as $tile_template) {
            $new_tile_template = TileTemplate::fromArray([
                'region_template_id' => $template->id,
                'x' => $tile_template->x,
                'y' => $tile_template->y,
                'type' => $tile_template->type,
            ]);

            $this->tile_template_db->insertTileTemplate($new_tile_template);
        }

        return true;
    }
}
