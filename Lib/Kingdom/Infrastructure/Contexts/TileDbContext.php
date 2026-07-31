<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Entity\Tile;

class TileDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'tiles';

    public function insertTile(Tile $tile): bool
    {
        $result = $this->save(self::TABLE_NAME, $tile->toDb());
        return (bool) $result;
    }

    /**
     * @param Tile[] $tiles
     */
    public function insertTiles(array $tiles): bool
    {
        if (empty($tiles)) {
            return true;
        }

        $chunk_size = 250;
        $chunks = array_chunk($tiles, $chunk_size);

        foreach ($chunks as $chunk) {
            $value_clauses = [];
            $parameters = [];

            foreach ($chunk as $index => $tile) {
                $value_clauses[] = "(:region_id_$index, :x_$index, :y_$index, :type_$index)";
                $parameters["region_id_$index"] = $tile->region_id;
                $parameters["x_$index"] = $tile->x;
                $parameters["y_$index"] = $tile->y;
                $parameters["type_$index"] = $tile->type->value;
            }

            $sql = "INSERT INTO tiles (region_id, x, y, type) VALUES " . implode(', ', $value_clauses);
            $statement = $this->pdo->prepare($sql);
            $statement->execute($parameters);
        }

        return true;
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
