<?php

namespace Lib\Terminal\Service\Files;

use Lib\Terminal\Domain\File;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class UpdateFilesService
{
    public function __construct(
        private TerminalFilesDbContext $db,
    ) {}

    public function updateFile(File $file): void
    {
        $this->db->updateFile($file);
    }
}