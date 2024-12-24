<?php

namespace Lib\Terminal\Infrastructure\Contexts;

use Lib\PdoDbContext;
use Lib\Terminal\Domain\File;

class TerminalFilesDbContext extends PdoDbContext
{
    private const TABLE_NAME = 'terminal_files';

    public function createFile(File $file): bool
    {
        $result = $this->save(self::TABLE_NAME, $file->toDb());
        return (bool) $result;
    }

    /**
     * @param int $directory_id
     * @return File[]
     */
    public function fetchFiles(int $directory_id): array
    {
        $files = $this->fetchAllByIds(self::TABLE_NAME, "directory_id", [$directory_id]);

        return array_map([File::class, "fromArray"], $files);
    }

    public function updateFiles(File $file): bool
    {
        return $this->update(self::TABLE_NAME, $file->toDb(), $file->getId());
    }
}
