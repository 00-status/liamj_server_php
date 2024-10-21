<?php

namespace Lib\WeaponMaker\Domain;

class Weapon
{
    private int $id;
    private string $default_name;
    private ?string $name;
    private string $rarity;
    private array $properties;
    private WeaponDamage $base_damage;
    private WeaponDamage $extra_damage;
    private WeaponEffect $weapon_effect;
    private int $effective_range;
    private int $ineffective_range;

    public function __construct(
        int $id,
        string $default_name,
        ?string $name,
        string $rarity,
        array $properties,
        WeaponDamage $base_damage,
        WeaponDamage $extra_damage,
        WeaponEffect $weapon_effect,
        int $effective_range,
        int $ineffective_range
    ) {
        $this->id = $id;
        $this->default_name = $default_name;
        $this->name = $name;
        $this->rarity = $rarity;
        $this->properties = $properties;
        $this->base_damage = $base_damage;
        $this->extra_damage = $extra_damage;
        $this->weapon_effect = $weapon_effect;
        $this->effective_range = $effective_range;
        $this->ineffective_range = $ineffective_range;
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function getDefaultName(): string
    {
        return $this->default_name;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getRarity(): string
    {
        return $this->rarity;
    }

    public function getProperties(): array
    {
        return $this->properties;
    }

    public function getBaseDamage(): WeaponDamage
    {
        return $this->base_damage;
    }

    public function getExtraDamage(): WeaponDamage
    {
        return $this->extra_damage;
    }

    public function getWeaponEffect(): WeaponEffect
    {
        return $this->weapon_effect;
    }

    public function getEffectiveRange(): int
    {
        return $this->effective_range;
    }
}
