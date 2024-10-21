<?php

namespace Lib\WeaponMaker\Domain;

class BaseWeapon
{
    private string $name;
    private array $properties;
    private WeaponDamage $base_damage;
    private int $effective_range;
    private int $ineffective_range;

    public function __construct(
        string $name,
        array $properties,
        WeaponDamage $base_damage,
        int $effective_range,
        int $ineffective_range
    ) {
        $this->name = $name;
        $this->properties = $properties;
        $this->base_damage = $base_damage;
        $this->effective_range = $effective_range;
        $this->ineffective_range = $ineffective_range;
    }

    public function getName(): string
    {
        return $this->name;
    }

    public function getProperties(): array
    {
        return $this->properties;
    }

    public function getBaseDamage(): WeaponDamage
    {
        return $this->base_damage;
    }

    public function getEffectiveRange(): int
    {
        return $this->effective_range;
    }

    public function getIneffectiveRange(): int
    {
        return $this->ineffective_range;
    }
}
