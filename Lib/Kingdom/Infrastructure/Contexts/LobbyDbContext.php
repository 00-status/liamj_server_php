<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DateTimeImmutable;
use DomainException;
use InvalidArgumentException;
use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Entity\Lobby;
use PDO;

class LobbyDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'lobbies';

    public function insertLobby(Lobby $lobby): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $lobby->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert Lobby!", 500);
        }

        return (int) $inserted_id;
    }

    public function fetchLobbyById(int $id): ?Lobby
    {
        $row = $this->fetchById(self::TABLE_NAME, $id);
        if (!$row || !empty($row['deleted'])) {
            return null;
        }

        return Lobby::fromArray($row);
    }

    public function fetchLobbyByCode(int $lobby_code): ?Lobby
    {
        $stmt = $this->pdo->prepare("SELECT * FROM " . self::TABLE_NAME . " WHERE lobby_code = :lobby_code AND deleted IS NULL");
        $stmt->bindParam(':lobby_code', $lobby_code, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return Lobby::fromArray($row);
    }

    public function countActiveLobbies(): int
    {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM " . self::TABLE_NAME . " WHERE deleted IS NULL");
        return (int) $stmt->fetchColumn();
    }

    /**
     * @return Lobby[]
     */
    public function fetchExpiredLobbies(): array
    {
        $query = $this->pdo->query("SELECT * FROM " . self::TABLE_NAME . " WHERE deleted IS NULL AND time_to_die < CURRENT_TIMESTAMP");
        $result = $query->fetchAll(PDO::FETCH_ASSOC);

        return array_map([Lobby::class, "fromArray"], $result);
    }

    /**
     * Deletes the rows matching the given IDs.
     * @param int[] $ids
     * @return void
     */
    public function deleteRows(array $ids): void
    {
        $now = new DateTimeImmutable()->format(DateTimeImmutable::ATOM);
        $deleted_column = ["deleted" => $now];
        foreach($ids as $id) {
            $this->update(self::TABLE_NAME, $deleted_column, $id);
        }
    }

    /**
     * Updates a column with the matching ID.
     * @param int $id
     * @param array $columns
     * @return bool
     */
    public function updateColumn(int $id, array $columns): bool
    {
        if (empty($columns)) {
            throw new InvalidArgumentException("No columns specified!");
        }

        return $this->update(self::TABLE_NAME, $columns, $id);
    }
}
