<?php

namespace Lib\Terminal\Service\Server;

use Lib\Terminal\Domain\Server;
use Lib\Terminal\Infrastructure\TerminalServerDbContext;

class UpdateServerService
{
    public function __construct(
        private TerminalServerDbContext $db,
    ) {}

    public function updateServerService(Server $server): bool
    {
        $is_saved = $this->db->updateServer($server);

        return $is_saved;
    }
}