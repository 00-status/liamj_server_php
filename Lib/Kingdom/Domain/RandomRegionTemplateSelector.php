<?php

namespace Lib\Kingdom\Domain;

use Lib\Kingdom\Domain\Entity\RegionTemplate;

class RandomRegionTemplateSelector implements RegionTemplateSelectorInterface
{
    /**
     * @param RegionTemplate[] $templates
     */
    public function selectTemplate(array $templates, int $origin_x, int $origin_y): RegionTemplate
    {
        if (empty($templates)) {
            throw new \InvalidArgumentException("No region templates available for selection.");
        }
        return $templates[array_rand($templates)];
    }
}
