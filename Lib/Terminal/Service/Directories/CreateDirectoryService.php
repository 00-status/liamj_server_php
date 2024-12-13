<?php

namespace Lib\Terminal\Service\Directories;

use DomainException;
use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;

class CreateDirectoryService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
    ) {}

    public function createDirectory(Directory $directory): Directory
    {
        $new_directory_id = $this->db->insertDirectory($directory);

        $directory = $this->db->fetchDirectory($new_directory_id);

        if (empty($directory)) {
            throw new DomainException("Directory was created, but could not be fetched", 500);
        }

        return $directory;
    }
}
