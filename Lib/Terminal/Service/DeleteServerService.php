<?php

namespace Lib\Terminal\Service;

use Lib\Terminal\Infrastructure\TerminalServerDbContext;

class DeleteServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    public function deleteServer(int $server_id)
    {
        // TODO: Delete from the directories and files tables before deleting the server.

        $this->db->deleteServer($server_id);
    }
}
