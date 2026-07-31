<?php

namespace Lib\Kingdom\Domain\Entity;

readonly class KingdomGenerationConfig
{
    public function __construct(
        public string $name = "New Kingdom",
        public int $width = 50,
        public int $height = 50,
        public int $step = 10,
        public int $jitter = 2,
        public ?int $seed = null,
    ) {}
}
