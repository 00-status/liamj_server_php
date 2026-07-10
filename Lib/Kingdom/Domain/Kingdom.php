<?php

namespace Lib\Kingdom\Domain;

class Kingdom {
    function __construct(
        public private(set) int $id,
        public private(set) string $name,
        /** @var Region[] */
        public private(set) array $regions,
    ) {}
}