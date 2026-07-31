<?php

namespace Lib\Kingdom\Domain\Entity;

class Kingdom {
    function __construct(
        public private(set) int $id,
        public private(set) string $name,
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
            regions: $regions,
        );
    }

    public function toDb(): array
    {
        return [
            "name" => $this->name,
        ];
    }
}
