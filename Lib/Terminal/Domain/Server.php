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

    public static function fromArray($server_array): self
    {
        return new self(
            $server_array['id'],
            $server_array['name'],
            [],
        );
    }

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
