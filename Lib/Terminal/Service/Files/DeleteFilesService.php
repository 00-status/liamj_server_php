<?php

namespace Lib\Terminal\Service\Files;

use Lib\Terminal\Infrastructure\Contexts\TerminalFilesDbContext;

class DeleteFilesService
{
    public function __construct(
        private TerminalFilesDbContext $db,
    ) {}

    public function deleteFile(int $file_id): void
    {
        $is_deleted = $this->db->deleteFile($file_id);

        if (!$is_deleted) {
            throw new \DomainException("Cannot delete file!", 500);
        }
    }
}