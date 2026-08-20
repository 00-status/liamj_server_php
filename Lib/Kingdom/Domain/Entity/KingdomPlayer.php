<?php

namespace Lib\Kingdom\Domain\Entity;

class KingdomPlayer
{
    public function __construct(
        public private(set) int $id,
        public private(set) int $lobby_id,
        public private(set) string $name,
        public private(set) bool $is_leader,
        public private(set) string $authorization_token,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            lobby_id: (int) $data['lobby_id'],
            name: (string) $data['name'],
            is_leader: (bool) ($data['is_leader'] ?? false),
            authorization_token: (string) $data['authorization_token'],
        );
    }

    public function toDb(): array
    {
        return [
            "lobby_id" => $this->lobby_id,
            "name" => $this->name,
            "is_leader" => $this->is_leader ? 1 : 0,
            "authorization_token" => $this->authorization_token,
        ];
    }
}
