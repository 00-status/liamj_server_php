<?php

namespace Lib\Terminal\Infrastructure;

use DomainException;
use Lib\PdoDbContext;
use Lib\Terminal\Domain\Directory;

class TerminalDirectoriesDbContext extends PdoDbContext
{
    private const string TABLE_NAME = 'terminal_directories';

    public function insertDirectory(Directory $directory): int
    {
        $inserted_id = $this->save(self::TABLE_NAME, $directory->toDb());

        if (empty($inserted_id)) {
            throw new DomainException("Unable to insert ID!", 500);
        }

        return (int) $inserted_id;
    }

    public function fetchDirectory(int $directory_id): ?Directory
    {
        $directory_array = $this->fetchById(self::TABLE_NAME, $directory_id);

        return Directory::fromArray($directory_array);
    }

    /**
     * @param int[] $directory_ids
     * @return Directory[]
     */
    public function fetchDirectories(int $server_id): array
    {
        $results = $this->fetchAllByIds(self::TABLE_NAME, "server_id", [$server_id]);

        return array_map([Directory::class, "fromArray"], $results);
    }

    public function updateDirectory(Directory $directory): bool
    {
        $result = $this->update(self::TABLE_NAME, $directory->toDb(), $directory->getId());
        return (bool) $result;
    }

    public function deleteDirectory(int $id): bool
    {
        return $this->deleteDirectory($id);
    }
}
