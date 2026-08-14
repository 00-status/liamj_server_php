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
    ) {
        if ($this->width < 5 || $this->width > 200) {
            throw new \InvalidArgumentException("Kingdom width must be between 5 and 200.");
        }

        if ($this->height < 5 || $this->height > 200) {
            throw new \InvalidArgumentException("Kingdom height must be between 5 and 200.");
        }

        if ($this->step <= 0 || $this->step > 100) {
            throw new \InvalidArgumentException("Kingdom step must be a positive integer between 1 and 100.");
        }

        if ($this->jitter < 0 || $this->jitter > 50) {
            throw new \InvalidArgumentException("Kingdom jitter must be a positive integer between 1 and 50.");
        }   
    }
}
