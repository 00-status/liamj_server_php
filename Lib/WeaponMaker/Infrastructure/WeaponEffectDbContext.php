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

    public function insertWeaponEffect(WeaponEffect $weapon_effect): bool
    {
        $result = $this->save(self::WEAPON_EFFECTS, $weapon_effect->toDb());

        return (bool) $result;
    }

    public function updateWeaponEffect(WeaponEffect $weapon_effect): bool
    {
        $result = $this->update(self::WEAPON_EFFECTS, $weapon_effect->toDb(), $weapon_effect->getId());

        return $result;
    }
}
