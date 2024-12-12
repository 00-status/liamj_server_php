<?php

namespace Lib\Terminal\Domain;

class Server implements \JsonSerializable
{
    /** @param Directory[] $directories */
    public function __construct(
        private int $id,
        private string $name,
        private array $directories
    ) {}

    public function jsonSerialize(): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
            "directories" => $this->directories,
        ];
    }

    public function toDb(): array
    {
        return [
            "id" => $this->id,
            "name" => $this->name,
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

    /** @return Directory[] */
    public function getDirectories(): array
    {
        return $this->directories;
    }
}
