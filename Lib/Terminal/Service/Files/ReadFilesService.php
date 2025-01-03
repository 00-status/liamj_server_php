<?php

namespace Lib\Terminal\Service\Files;

use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class ReadFilesService
{
    public function __construct(
        private TerminalFilesDbContext $db,
    ) {}

    public function readFiles(int $directory_id): array
    {
        return $this->db->fetchFiles($directory_id);
    }
}
