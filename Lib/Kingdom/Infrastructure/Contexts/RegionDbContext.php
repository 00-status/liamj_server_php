<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DomainException;
use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Entity\Region;

class RegionDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'regions';

    public function insertRegion(Region $region): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $region->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert Region!", 500);
        }

        return (int) $inserted_id;
    }

    /**
     * @return Region[]
     */
    public function fetchRegions(int $kingdom_id): array
    {
        $rows = $this->fetchAllByIds(self::TABLE_NAME, "kingdom_id", [$kingdom_id]);

        return array_map(function (array $row) {
            return Region::fromArray($row);
        }, $rows);
    }

    public function fetchRegion(int $id): ?Region
    {
        $row = $this->fetchById(self::TABLE_NAME, $id);

        if (!$row) {
            return null;
        }

        return Region::fromArray($row);
    }

    public function updateRegion(Region $region): bool
    {
        return $this->update(self::TABLE_NAME, $region->toDb(), $region->id);
    }

    public function deleteRegion(int $id): bool
    {
        return $this->delete(self::TABLE_NAME, $id);
    }
}
