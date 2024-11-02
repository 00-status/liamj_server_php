<?php

namespace Lib\WeaponMaker\Service;
use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;

class PostWeaponEffectService
{
    public function __construct(
        private WeaponEffectDbContext $db,
    ) {
    }

    public function saveWeaponEffect(WeaponEffect $weapon_effect): bool
    {
        $was_inserted = $this->db->insertWeaponEffect($weapon_effect);

        return $was_inserted;
    }
}
