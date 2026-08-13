<?php

namespace Lib\Kingdom\Service\RegionTemplate;

use Lib\Kingdom\Infrastructure\Contexts\RegionTemplateDbContext;

class DeleteRegionTemplateService
{
    public function __construct(
        private RegionTemplateDbContext $template_db,
    ) {}

    public function deleteRegionTemplate(int $id): bool
    {
        return $this->template_db->deleteRegionTemplate($id);
    }
}
