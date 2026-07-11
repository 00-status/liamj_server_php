<?php

namespace Lib\Kingdom\Service\RegionTemplate;

use Lib\Kingdom\Domain\RegionTemplate;
use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;
use Lib\Kingdom\Infrastructure\Contexts\TileTemplateDbContext;

class ReadRegionTemplatesService
{
    public function __construct(
        private RegionTemplateDbContext $template_db,
        private TileTemplateDbContext $tile_template_db,
    ) {}

    /**
     * @return RegionTemplate[]
     */
    public function readRegionTemplates(): array
    {
        $templates = $this->template_db->fetchRegionTemplates();

        $assembled = [];
        foreach ($templates as $template) {
            $tile_templates = $this->tile_template_db->fetchTileTemplates($template->id);
            $assembled[] = RegionTemplate::fromArray([
                'id' => $template->id,
                'name' => $template->name,
            ], $tile_templates);
        }

        return $assembled;
    }
}
