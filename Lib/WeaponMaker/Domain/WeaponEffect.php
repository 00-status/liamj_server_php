<?php

namespace Lib\WeaponMaker\Domain;

class WeaponEffect implements \JsonSerializable
{
    private int $id;
    private string $name;
    private string $description;
    /** @param string[] $rarities*/
    private array $rarities;
    /** @param string[] $tags*/
    private array $tags;

    public function __construct(int $id, string $name, string $description, array $rarities, array $tags)
    {
        $this->id = $id;
        $this->name = $name;
        $this->description = $description;
        $this->rarities = $rarities;
        $this->tags = $tags;
    }

    public static function fromArray(array $weapon_effect): self
    {
        return new self(
            $weapon_effect["id"] ?? 0,
            $weapon_effect["name"],
            $weapon_effect["description"],
            $weapon_effect["rarities"],
            $weapon_effect["tags"],
        );
    }

    public function jsonSerialize(): array
    {
        return [
            "id" => $this->getId(),
            "name" => $this->getName(),
            "description" => $this->getDescription(),
            "rarities" => $this->getRarities(),
            "tags" => $this->getTags(),
        ];
    }

    public function toDb(): array
    {
        $rarities = "{" . implode(",", $this->getRarities()) . "}";
        $tags = "{" . implode(",", $this->getTags()) . "}";

        return [
            "name" => $this->getName(),
            "description" => $this->getDescription(),
            "rarities" => $rarities,
            "tags" => $tags,
        ];
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function getRarities(): array
    {
        return $this->rarities;
    }

    public function getTags(): array
    {
        return $this->tags;
    }
}
