<?php

namespace Lib\Terminal\Service\Files;

use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class UpdateFilesService
{
    public function __construct(
        private TerminalFilesDbContext $db,
    ) {}
}