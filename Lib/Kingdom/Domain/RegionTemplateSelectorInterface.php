<?php

namespace Lib\Kingdom\Domain;

interface RegionTemplateSelectorInterface
{
    /**
     * Select a RegionTemplate for a given origin coordinate on the map.
     * 
     * @param RegionTemplate[] $templates
     */
    public function selectTemplate(array $templates, int $origin_x, int $origin_y): RegionTemplate;
}
