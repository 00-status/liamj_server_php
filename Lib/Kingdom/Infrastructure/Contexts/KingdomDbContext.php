<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DomainException;
use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Entity\Kingdom;

class KingdomDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'kingdoms';

    public function insertKingdom(Kingdom $kingdom): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $kingdom->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert Kingdom!", 500);
        }

        return (int) $inserted_id;
    }

    /**
     * @return Kingdom[]
     */
    public function fetchKingdoms(): array
    {
        $rows = $this->fetchAll(self::TABLE_NAME);

        return array_map(function (array $row) {
            return Kingdom::fromArray($row);
        }, $rows);
    }

    public function fetchKingdom(int $id): ?Kingdom
    {
        $row = $this->fetchById(self::TABLE_NAME, $id);

        if (!$row) {
            return null;
        }

        return Kingdom::fromArray($row);
    }

    public function fetchKingdomByLobbyId(int $lobby_id): ?Kingdom
    {
        $stmt = $this->pdo->prepare("SELECT * FROM " . self::TABLE_NAME . " WHERE lobby_id = :lobby_id");
        $stmt->bindParam(':lobby_id', $lobby_id, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return Kingdom::fromArray($row);
    }

    public function deleteKingdom(int $id): bool
    {
        return $this->delete(self::TABLE_NAME, $id);
    }
}
