<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Infrastructure\Contexts\TerminalDirectoriesDbContext;
use \Lib\Terminal\Domain\Directory;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class ReadDirectoriesService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
        private TerminalFilesDbContext $file_db,
    ) {}

    /**
     * @return Directory[]
     */
    public function readDirectories(int $server_id): array
    {
        $directories = $this->db->fetchDirectories($server_id);

        $directories_by_parent_id = array_reduce($directories, function ($carry, Directory $directory) {
            $parent_dir = $directory->getParentDirectory();
            if ($parent_dir) {
                $existing_contents = $carry[$parent_dir] ?? [];
                $carry[$parent_dir] = [...$existing_contents, $directory->getId()];
            }

            return $carry;
        }, []);

        foreach ($directories as $directory) {
            $sub_directories = $directories_by_parent_id[$directory->getId()] ?? null;

            if ($sub_directories) {
                $directory->setSubDirectories($sub_directories);
            }
        }

        // TODO: We could have fewer DB queries by collating all directory_ids and
        // doing one query instead of a query per directory.
        foreach ($directories as $directory) {
            $files = $this->file_db->fetchFiles($directory->getId());

            $directory->setFiles($files);
        }

        return $directories;
    }
}
