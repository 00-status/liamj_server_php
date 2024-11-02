<?php

namespace Lib\WeaponMaker\Infrastructure;
use Lib\WeaponMaker\Domain\WeaponEffect;

class WeaponEffectDbContext extends PdoDbContext
{
    private const WEAPON_EFFECTS = "weapon_effects";

    public function fetchWeaponEffects(): array
    {
        $weapon_effects_array = $this->fetchAll(self::WEAPON_EFFECTS);

        $weapon_effects = [];
        foreach ($weapon_effects_array as $weapon_effect) {
            $weapon_effects[] = WeaponEffect::fromArray($weapon_effect);
        }

        return $weapon_effects;
    }

    public function insertWeaponEffect(): bool
    {
        // Convert to array
        // Strip out ID.
        // Return the result.
    }
}
