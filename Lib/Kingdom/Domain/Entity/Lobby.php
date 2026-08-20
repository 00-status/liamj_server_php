<?php

namespace Lib\Kingdom\Domain\Entity;

class Lobby
{
    /**
     * @param KingdomPlayer[] $players
     */
    public function __construct(
        public private(set) int $id,
        public private(set) string $lobby_code,
        public private(set) string $time_to_die,
        public private(set) string $created,
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
            lobby_code: (string) $data['lobby_code'],
            time_to_die: (string) $data['time_to_die'],
            created: (string) $data['created'],
            players: $players,
        );
    }

    public function toDb(): array
    {
        return [
            "lobby_code" => $this->lobby_code,
            "time_to_die" => $this->time_to_die,
            "created" => $this->created,
        ];
    }
}
