<?php

namespace Lib\Kingdom\Domain;

class Tile {
    function __construct(
        public private(set) int $id,
        public private(set) int $region_id,
        public private(set) int $x,
        public private(set) int $y,
        public private(set) TileType $type,
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            region_id: (int) $data['region_id'],
            x: (int) $data['x'],
            y: (int) $data['y'],
            type: $data['type'] instanceof TileType ? $data['type'] : TileType::from($data['type']),
        );
    }

    public function toDb(): array
    {
        return [
            "region_id" => $this->region_id,
            "x" => $this->x,
            "y" => $this->y,
            "type" => $this->type->value,
        ];
    }
}
