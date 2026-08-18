<?php

namespace Lib\Kingdom\Domain\Entity;

class Lobby
{
    /**
     * @param KingdomPlayer[] $players
     */
    public function __construct(
        public private(set) int $id,
        public private(set) int $lobby_code,
        public private(set) string $time_to_die,
        public private(set) string $created,
        public private(set) ?string $deleted = null,
        /** @var KingdomPlayer[] */
        public private(set) array $players = [],
    ) {}

    /**
     * @param array $data
     * @param KingdomPlayer[] $players
     */
    public static function fromArray(array $data, array $players = []): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            lobby_code: (int) $data['lobby_code'],
            time_to_die: (string) $data['time_to_die'],
            created: (string) $data['created'],
            deleted: isset($data['deleted']) ? (string) $data['deleted'] : null,
            players: $players,
        );
    }

    public function toDb(): array
    {
        return [
            "lobby_code" => $this->lobby_code,
            "time_to_die" => $this->time_to_die,
            "created" => $this->created,
            "deleted" => $this->deleted,
        ];
    }
}
