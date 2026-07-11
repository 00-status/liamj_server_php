<?php

namespace Lib\Kingdom\Domain;

class TileTemplate {
    function __construct(
        public private(set) int $id,
        public private(set) int $region_template_id,
        public private(set) int $x,
        public private(set) int $y,
        public private(set) TileType $type,
    ) {}
}