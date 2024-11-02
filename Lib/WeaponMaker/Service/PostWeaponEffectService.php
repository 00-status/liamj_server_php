<?php

namespace Lib\WeaponMaker\Service;
use Lib\WeaponMaker\Domain\WeaponEffect;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;

class PostWeaponEffectService
{
    private WeaponEffectDbContext $db;

    public function saveWeaponEffect(): WeaponEffect
    {
        // Call the insert DB method
    }
}
