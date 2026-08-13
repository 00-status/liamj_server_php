<?php

namespace Lib\Kingdom\Domain\Entity;

class RegionTemplate {
    function __construct(
        public private(set) int $id,
        public private(set) string $name,
        /** @var TileTemplate[] */
        public private(set) array $tile_templates = [],
    ) {}

    /**
     * @param array $data
     * @param TileTemplate[] $tile_templates
     */
    public static function fromArray(array $data, array $tile_templates = []): self
    {
        return new self(
            id: (int) ($data['id'] ?? 0),
            name: (string) $data['name'],
            tile_templates: $tile_templates,
        );
    }

    public function toDb(): array
    {
        return [
            "name" => $this->name,
        ];
    }
}
