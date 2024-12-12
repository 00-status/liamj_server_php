<?php

namespace Lib\Terminal\Service;

use Lib\Terminal\Domain\Server;
use Lib\Terminal\Infrastructure\TerminalServerDbContext;

class CreateServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    public function createServer(Server $server): bool
    {
        $created_server_id = $this->db->insertServer($server);

        $this->db->fetchServer($created_server_id);

        return empty($created_server) ? false : true;
    }
}