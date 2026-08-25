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
}
