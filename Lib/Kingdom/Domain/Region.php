<?php

namespace Lib\Kingdom\Domain;

class Region {
        function __construct(
        public private(set) int $id,
        public private(set) int $kingdom_id,
        public private(set) string $name,
        public private(set) int $origin_x,
        public private(set) int $origin_y,
        public private(set) RegionTemplate $region_template,
        /** @var Tile[] */
        public private(set) array $tiles,
    ) {}
}