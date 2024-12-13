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

    /**
     * @param int[] $directory_ids
     * @return Directory[]
     */
    public function fetchDirectories(array $directory_ids): array
    {
        $results = $this->fetchAllByIds(self::TABLE_NAME, $directory_ids);

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
