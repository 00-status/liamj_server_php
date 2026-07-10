<?php

namespace Lib\Kingdom\Domain;

class RegionTemplate {
    public private(set) int $id;
    /** @var Tile[] */
    public private(set) array $tiles;
}