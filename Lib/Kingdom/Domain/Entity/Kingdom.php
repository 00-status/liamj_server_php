<?php

namespace Lib\Kingdom\Domain\Entity;

class Kingdom {
    function __construct(
        public private(set) int $id,
        public private(set) string $name,
        public private(set) int $grid_width = 50,
        public private(set) int $grid_height = 50,
        /** @var Region[] */
        public private(set) array $regions = [],
    ) {}

    /**
     * @param array $data
     * @param Region[] $regions
     */
    public static function fromArray(array $data, array $regions = []): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            name: (string) $data['name'],
            grid_width: (int) ($data['grid_width'] ?? 50),
            grid_height: (int) ($data['grid_height'] ?? 50),
            regions: $regions,
        );
    }

    public function toDb(): array
    {
        return [
            "name" => $this->name,
            "grid_width" => $this->grid_width,
            "grid_height" => $this->grid_height,
        ];
    }
}
