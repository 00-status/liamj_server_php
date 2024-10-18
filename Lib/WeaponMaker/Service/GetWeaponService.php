<?php

namespace Lib\WeaponMaker\Service;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use PDO;

class GetWeaponService
{
    public function getWeapons(): array
    {
        $db = new WeaponEffectDbContext();

        return $db->fetchWeaponEffects();;
    }
}
