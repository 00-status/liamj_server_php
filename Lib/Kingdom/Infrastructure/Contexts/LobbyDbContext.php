<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DomainException;
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

    public function fetchLobbyByCode(int $lobby_code): ?Lobby
    {
        $stmt = $this->pdo->prepare("SELECT * FROM " . self::TABLE_NAME . " WHERE lobby_code = :lobby_code AND deleted IS NULL");
        $stmt->bindParam(':lobby_code', $lobby_code, PDO::PARAM_INT);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return Lobby::fromArray($row);
    }

    public function fetchLobbyById(int $id): ?Lobby
    {
        $row = $this->fetchById(self::TABLE_NAME, $id);
        if (!$row || !empty($row['deleted'])) {
            return null;
        }

        return Lobby::fromArray($row);
    }

    public function countActiveLobbies(): int
    {
        $stmt = $this->pdo->query("SELECT COUNT(*) FROM " . self::TABLE_NAME . " WHERE deleted IS NULL");
        return (int) $stmt->fetchColumn();
    }

    public function cullExpiredLobbies(): int
    {
        $stmt = $this->pdo->prepare("UPDATE " . self::TABLE_NAME . " SET deleted = CURRENT_TIMESTAMP WHERE deleted IS NULL AND time_to_die < CURRENT_TIMESTAMP");
        $stmt->execute();
        return $stmt->rowCount();
    }

    public function updateTimeToDie(int $id): bool
    {
        $stmt = $this->pdo->prepare("UPDATE " . self::TABLE_NAME . " SET time_to_die = CURRENT_TIMESTAMP + INTERVAL '3 hours' WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }
}
