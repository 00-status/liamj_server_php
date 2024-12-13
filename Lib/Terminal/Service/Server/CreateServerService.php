<?php

namespace Lib\Terminal\Service\Server;

use Lib\Terminal\Domain\Server;
use Lib\Terminal\Infrastructure\TerminalServerDbContext;

class CreateServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    public function createServer(Server $server): Server
    {
        $created_server_id = $this->db->insertServer($server);

        $server = $this->db->fetchServer($created_server_id);

        if (empty($server)) {
            throw new \DomainException("Server was created, but could not be fetched.", 500);
        }

        return $server;
    }
}