<?php

namespace Lib\Kingdom\Domain;

class RegionTemplate {
    public private(set) int $id;
    public private(set) int $name;
    /** @var TileTemplate[] */
    public private(set) array $tile_templates;
}