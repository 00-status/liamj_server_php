<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\TerminalDirectoriesDbContext;

class UpdateDirectoryService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
    ) {}

    public function updateDirectory(Directory $directory): bool
    {
        return $this->db->updateDirectory($directory);
    }
}
