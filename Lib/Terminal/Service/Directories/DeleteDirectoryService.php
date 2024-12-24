<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class DeleteDirectoryService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
        private TerminalFilesDbContext $files_db,
    ) {}

    public function deleteDirectory(int $directory_id): bool
    {
        $files = $this->files_db->fetchFiles($directory_id);

        foreach ($files as $file) {
            $this->files_db->deleteFile($file->getId());
        }

        return $this->db->deleteDirectory($directory_id);
    }
}
