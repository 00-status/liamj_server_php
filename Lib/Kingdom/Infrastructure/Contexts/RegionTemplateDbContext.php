<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DomainException;
use Lib\PdoDbContext;
use Lib\Kingdom\Domain\RegionTemplate;

class RegionTemplateDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'region_templates';

    public function insertRegionTemplate(RegionTemplate $template): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $template->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert Region Template!", 500);
        }

        return (int) $inserted_id;
    }

    /**
     * @return RegionTemplate[]
     */
    public function fetchRegionTemplates(): array
    {
        $rows = $this->fetchAll(self::TABLE_NAME);

        return array_map(function (array $row) {
            return RegionTemplate::fromArray($row);
        }, $rows);
    }

    public function fetchRegionTemplate(int $id): ?RegionTemplate
    {
        $row = $this->fetchById(self::TABLE_NAME, $id);

        if (!$row) {
            return null;
        }

        return RegionTemplate::fromArray($row);
    }

    public function updateRegionTemplate(RegionTemplate $template): bool
    {
        return $this->update(self::TABLE_NAME, $template->toDb(), $template->id);
    }

    public function deleteRegionTemplate(int $id): bool
    {
        return $this->delete(self::TABLE_NAME, $id);
    }
}
