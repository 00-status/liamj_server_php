<?php

namespace Lib\Kingdom\Infrastructure\Contexts;

use DomainException;
use Lib\PdoDbContext;
use Lib\Kingdom\Domain\Entity\KingdomPlayer;
use PDO;

class KingdomPlayerDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'kingdom_players';

    public function insertKingdomPlayer(KingdomPlayer $player): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $player->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert KingdomPlayer!", 500);
        }

        return (int) $inserted_id;
    }

    /**
     * @return KingdomPlayer[]
     */
    public function fetchPlayersInLobby(int $lobby_id): array
    {
        $stmt = $this->pdo->prepare("SELECT * FROM " . self::TABLE_NAME . " WHERE lobby_id = :lobby_id ORDER BY id ASC");
        $stmt->bindParam(':lobby_id', $lobby_id, PDO::PARAM_INT);
        $stmt->execute();

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(function (array $row) {
            return KingdomPlayer::fromArray($row);
        }, $rows);
    }

    public function fetchPlayerByToken(string $authz_token): ?KingdomPlayer
    {
        $stmt = $this->pdo->prepare("SELECT * FROM " . self::TABLE_NAME . " WHERE authorization_token = :token");
        $stmt->bindParam(':token', $authz_token, PDO::PARAM_STR);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$row) {
            return null;
        }

        return KingdomPlayer::fromArray($row);
    }

    public function isNameTakenInLobby(int $lobby_id, string $name): bool
    {
        $stmt = $this->pdo->prepare("SELECT COUNT(*) FROM " . self::TABLE_NAME . " WHERE lobby_id = :lobby_id AND LOWER(name) = LOWER(:name)");
        $stmt->bindParam(':lobby_id', $lobby_id, PDO::PARAM_INT);
        $stmt->bindParam(':name', $name, PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetchColumn() > 0;
    }
}
