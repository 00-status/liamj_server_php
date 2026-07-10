<?php

namespace Lib\Kingdom\Domain;

class Region {
        function __construct(
        public private(set) int $id,
        public private(set) int $origin_x,
        public private(set) int $origin_y,
        /** @var RegionTemplate[] */
        public private(set) array $region_templates,
    ) {}
}