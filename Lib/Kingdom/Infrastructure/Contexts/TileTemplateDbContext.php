<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use Lib\PdoDbContext;
use Lib\Kingdom\Domain\TileTemplate;

class TileTemplateDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'tile_templates';

    public function insertTileTemplate(TileTemplate $tile_template): bool
    {
        $result = $this->save(self::TABLE_NAME, $tile_template->toDb());
        return (bool) $result;
    }

    /**
     * @return TileTemplate[]
     */
    public function fetchTileTemplates(int $region_template_id): array
    {
        $rows = $this->fetchAllByIds(self::TABLE_NAME, "region_template_id", [$region_template_id]);

        return array_map(function (array $row) {
            return TileTemplate::fromArray($row);
        }, $rows);
    }

    public function deleteTileTemplatesByRegionTemplate(int $region_template_id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM " . self::TABLE_NAME . " WHERE region_template_id = :region_template_id");
        $stmt->bindParam(':region_template_id', $region_template_id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
