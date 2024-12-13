<?php

namespace Lib\Terminal\Domain;

use Lib\Terminal\Domain\File;

class Directory implements \JsonSerializable
{
    /**
     * @param int[] $sub_directories
     * @param File[] $files
     */
    public function __construct(
        private int $id,
        private int $server_id,
        private string $name,
        private \DateTimeImmutable $date_created,
        private ?int $parent_directory,
        private array $sub_directories,
        private array $files,
    ) {}

    public static function fromArray(array $directory): self
    {
        return new self(
            $directory["id"],
            $directory["server_id"],
            $directory["name"],
            $directory["date_created"],
            $directory["parent_directory"],
            $directory["sub_directories"],
            [],
        );
    }

    public function jsonSerialize(): array
    {
        return [
            "id" => $this->id,
            "server_id" => $this->server_id,
            "name" => $this->name,
            "date_created" => $this->date_created->format(\DateTime::ATOM),
            "parent_directory" => $this->parent_directory,
            "sub_directories" => $this->sub_directories,
            "files" => $this->files,
        ];
    }

    public function toDb(): array
    {
        $sub_directories = "{" . implode(",", $this->sub_directories) . "}";

        return [
            "server_id" => $this->server_id,
            "name" => $this->name,
            "date_created" => $this->$this->date_created->format(\DateTime::ATOM),
            "parent_directory" => $this->parent_directory,
            "sub_directories" => $sub_directories,
        ];
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getServerId(): int
    {
        return $this->server_id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getDateCreated(): \DateTimeImmutable
    {
        return $this->date_created;
    }

    public function getParentDirectory(): ?int
    {
        return $this->parent_directory;
    }

    /** @return int[] */
    public function getSubDirectories(): array
    {
        return $this->sub_directories;
    }
}
