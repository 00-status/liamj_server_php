<?php

namespace Lib\Terminal\Domain;

class File implements \JsonSerializable
{
    public function __construct(
        private int $id,
        private int $directory_id,
        private string $name,
        private string $contents,
        private ?string $encryption_code,
        private string $creator_user_name,
        private \DateTimeImmutable $date_created,
        private \DateTimeImmutable $date_modified,
    ) {}

    public function jsonSerialize(): array
    {
        return [
            "id" => $this->id,
            "directory_id" => $this->directory_id,
            "name" => $this->name,
            "contents" => $this->contents,
            "encryption_code" => $this->encryption_code,
            "creator_user_name" => $this->creator_user_name,
            "date_created" => $this->date_created->format(\DateTime::ATOM),
            "date_modified" => $this->date_modified->format(\DateTime::ATOM),
        ];
    }

    public function toDb(): array
    {
        return [
            "id" => $this->id,
            "directory_id" => $this->directory_id,
            "name" => $this->name,
            "contents" => $this->contents,
            "encryption_code" => $this->encryption_code,
            "creator_user_name" => $this->creator_user_name,
            "date_created" => $this->date_created->format(\DateTime::ATOM),
            "date_modified" => $this->date_modified->format(\DateTime::ATOM),
        ];
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getDirectoryId(): int
    {
        return $this->directory_id;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getContents(): string
    {
        return $this->contents;
    }

    public function getEncryptionCode(): ?string
    {
        return $this->encryption_code;
    }

    public function getCreatorUserName(): string
    {
        return $this->creator_user_name;
    }

    public function getDateCreated(): \DateTimeImmutable
    {
        return $this->date_created;
    }

    public function getDateModified(): \DateTimeImmutable
    {
        return $this->date_modified;
    }
}
