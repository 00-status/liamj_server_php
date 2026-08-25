<?php

namespace Lib\Kingdom\Domain\Entity;

class KingdomPlayerDTO
{
    public function __construct(
        public private(set) int $id,
        public private(set) string $name,
        public private(set) bool $is_leader,
    ) {}
}
