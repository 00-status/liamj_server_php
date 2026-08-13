<?php

namespace Lib\Kingdom\Service\Kingdom;

use Lib\Kingdom\Infrastructure\Contexts\KingdomDbContext;

class DeleteKingdomService
{
    public function __construct(
        private KingdomDbContext $kingdom_db,
    ) {}

    public function deleteKingdom(int $id): bool
    {
        return $this->kingdom_db->deleteKingdom($id);
    }
}
