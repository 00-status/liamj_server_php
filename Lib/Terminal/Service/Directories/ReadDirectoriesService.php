<?php

namespace Lib\Terminal\Service\Directories;

use Lib\Terminal\Infrastructure\TerminalDirectoriesDbContext;
use \Lib\Terminal\Domain\Directory;

class ReadDirectoriesService
{
    public function __construct(
        private TerminalDirectoriesDbContext $db,
    ) {}

    /**
     * @return Directory[]
     */
    public function readDirectories(int $server_id): array
    {
        $directories = $this->db->fetchDirectories($server_id);

        // TODO: Attach directory files here.

        return $directories;
    }
}
