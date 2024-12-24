<?php

namespace Lib\Terminal\Service\Server;

use Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;
use Lib\Terminal\Infrastructure\Contexts\TerminalServerDbContext;

class DeleteServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
        private TerminalDirectoriesDbContext $directories_db,
        private TerminalFilesDbContext $files_db,
    ) {}

    public function deleteServer(int $server_id): void
    {
        $directories = $this->directories_db->fetchDirectories($server_id);
        $files = $this->getFiles($directories);

        foreach ($files as $file) {
            $this->files_db->deleteFile($file->getId());
        }

        foreach ($directories as $directory) {
            $this->directories_db->deleteDirectory($directory->getId());
        }

        $this->db->deleteServer($server_id);
    }

    /**
     * @param Directory[] $directories
     * @return \Lib\Terminal\Domain\File[]
     */
    private function getFiles(array $directories): array
    {
        $files = [];
        foreach ($directories as $directory) {
            $files = [...$files, ...$this->files_db->fetchFiles($directory->getId())];
        }

        return $files;
    }
}
