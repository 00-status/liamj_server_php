<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;

class UpdateDirectoryService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
    ) {}

    public function updateDirectory(Directory $directory): bool
    {
        $directory_to_update = $this->db->fetchDirectory($directory->getId());

        if (empty($directory_to_update)) {
            throw new \Exception("Directory to update does not exist!", 404);
        }

        return $this->db->updateDirectory($directory);
    }
}
