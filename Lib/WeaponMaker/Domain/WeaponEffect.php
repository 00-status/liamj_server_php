<?php

namespace Lib\WeaponMaker\Domain;

class WeaponEffect
{
    public function __construct(
        public private(set) int $id,
        public private(set) string $name,
        public private(set) string $description,
        /** @var string[] */
        public private(set) array $rarities,
        /** @var string[] */
        public private(set) array $tags,
    ) {}

    public static function fromArray(array $weapon_effect): self
    {
        return new self(
            id: $weapon_effect["id"] ?? 0,
            name: $weapon_effect["name"],
            description: $weapon_effect["description"],
            rarities: $weapon_effect["rarities"],
            tags: $weapon_effect["tags"],
        );
    }

    public function toDb(): array
    {
        return [
            "name" => $this->name,
            "description" => $this->description,
            "rarities" => "{" . implode(",", $this->rarities) . "}",
            "tags" => "{" . implode(",", $this->tags) . "}",
        ];
    }
}