<?php

namespace Lib\WeaponMaker\Infrastructure;

class WeaponEffectDbContext extends PdoDbContext
{
    private const WEAPON_EFFECTS = "weapon_effects";

    public function fetchWeaponEffects(): array
    {
        return $this->fetchAll(self::WEAPON_EFFECTS);
    }
}
