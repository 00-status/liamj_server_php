<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Tile;

class TileDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'tiles';

    public function insertTile(Tile $tile): bool
    {
        $result = $this->save(self::TABLE_NAME, $tile->toDb());
        return (bool) $result;
    }

    /**
     * @return Tile[]
     */
    public function fetchTiles(int $region_id): array
    {
        $rows = $this->fetchAllByIds(self::TABLE_NAME, "region_id", [$region_id]);

        return array_map(function (array $row) {
            return Tile::fromArray($row);
        }, $rows);
    }

    public function deleteTilesByRegion(int $region_id): bool
    {
        $stmt = $this->pdo->prepare("DELETE FROM " . self::TABLE_NAME . " WHERE region_id = :region_id");
        $stmt->bindParam(':region_id', $region_id, \PDO::PARAM_INT);
        return $stmt->execute();
    }
}
