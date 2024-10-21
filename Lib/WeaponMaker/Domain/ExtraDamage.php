<?php

namespace Lib\WeaponMaker\Domain;

class ExtraDamage
{
    private WeaponDamage $weapon_damage;
    private array $rarity_levels;
    private array $tags;

    public function __construct(WeaponDamage $weapon_damage, array $rarity_levels, array $tags)
    {
        $this->weapon_damage = $weapon_damage;
        $this->rarity_levels = $rarity_levels;
        $this->tags = $tags;
    }

    public function getWeaponDamage(): WeaponDamage
    {
        return $this->weapon_damage;
    }

    public function getRarityLevels(): array
    {
        return $this->rarity_levels;
    }

    public function getTags(): array
    {
        return $this->tags;
    }
}
