<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Infrastructure\TerminalDirectoriesDbContext;

class DeleteDirectoryService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
    ) {}

    public function deleteDirectory(int $directory_id): bool
    {
        return $this->db->deleteDirectory($directory_id);
    }
}
