<?php

namespace Lib\WeaponMaker\Service;

use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;

class PutWeaponEffectService
{

    public function __construct(
        private WeaponEffectDbContext $db,
    ) {
    }

    public function updateWeaponEffect(WeaponEffect $weapon_effect): bool
    {
        $is_saved = $this->db->updateWeaponEffect($weapon_effect);

        return $is_saved;
    }

}
