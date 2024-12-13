<?php

namespace Lib\Terminal\Service\Server;

use DI\NotFoundException;
use Lib\Terminal\Domain\Server;
use Lib\Terminal\Infrastructure\Contexts\TerminalServerDbContext;

class ReadServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    /**
     * @return Server[]
     */
    public function readServers(): array
    {
        return $this->db->fetchServers();
    }
}
