<?php

namespace Lib\Kingdom\Domain\Entity;

class Region {
    function __construct(
        public private(set) int $id,
        public private(set) int $kingdom_id,
        public private(set) ?int $region_template_id,
        public private(set) string $name,
        public private(set) int $origin_x,
        public private(set) int $origin_y,
        public private(set) ?RegionTemplate $region_template = null,
        /** @var Tile[] */
        public private(set) array $tiles = [],
    ) {}

    /**
     * @param array $data
     * @param RegionTemplate|null $region_template
     * @param Tile[] $tiles
     */
    public static function fromArray(array $data, ?RegionTemplate $region_template = null, array $tiles = []): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            kingdom_id: (int) $data['kingdom_id'],
            region_template_id: isset($data['region_template_id']) ? (int) $data['region_template_id'] : null,
            name: (string) $data['name'],
            origin_x: (int) $data['origin_x'],
            origin_y: (int) $data['origin_y'],
            region_template: $region_template,
            tiles: $tiles,
        );
    }

    public function toDb(): array
    {
        return [
            "kingdom_id" => $this->kingdom_id,
            "region_template_id" => $this->region_template_id ?? $this->region_template?->id,
            "name" => $this->name,
            "origin_x" => $this->origin_x,
            "origin_y" => $this->origin_y,
        ];
    }
}
