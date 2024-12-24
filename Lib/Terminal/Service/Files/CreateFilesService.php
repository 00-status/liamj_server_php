<?php

namespace Lib\Terminal\Service\Files;

use Lib\Terminal\Domain\File;
use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class CreateFilesService
{
    public function __construct(
        private TerminalFilesDbContext $db,
    ) {}

    public function createFile(File $file): void
    {
        $this->db->createFile($file);
    }
}