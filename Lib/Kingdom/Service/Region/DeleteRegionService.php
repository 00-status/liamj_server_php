<?php

namespace Lib\Kingdom\Service\Region;

use Lib\Kingdom\Infrastructure\Contexts\RegionDbContext;

class DeleteRegionService
{
    public function __construct(
        private RegionDbContext $region_db,
    ) {}

    public function deleteRegion(int $id): bool
    {
        return $this->region_db->deleteRegion($id);
    }
}
