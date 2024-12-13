<?php

namespace Lib\Terminal\Service\Server;

use DI\NotFoundException;
use Lib\Terminal\Domain\Server;
use Lib\Terminal\Infrastructure\TerminalServerDbContext;

class ReadServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    public function readServerService(int $server_id): Server
    {
        $server = $this->db->fetchServer($server_id);

        if (empty($server)) {
            throw new NotFoundException("Cannot find terminal server!", 404);
        }

        return $server;
    }
}
