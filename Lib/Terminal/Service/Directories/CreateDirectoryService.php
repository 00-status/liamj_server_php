<?php

namespace Lib\Terminal\Service\Directories;

use DomainException;
use Exception;
use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalServerDbContext;

class CreateDirectoryService
{
    public function __construct(
        private TerminalServerDbContext $server_db,
        private TerminalDirectoriesDbContext $db,
    ) {}

    public function createDirectory(Directory $directory): Directory
    {
        $server = $this->server_db->fetchServer($directory->getServerId());

        if (!$server) {
            throw new Exception("Server does not exist!", 400);
        }

        $new_directory_id = $this->db->insertDirectory($directory);

        $directory = $this->db->fetchDirectory($new_directory_id);

        if (empty($directory)) {
            throw new DomainException("Directory was created, but could not be fetched", 500);
        }

        return $directory;
    }
}
