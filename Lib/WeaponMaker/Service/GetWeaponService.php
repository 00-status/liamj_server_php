<?php

namespace Lib\WeaponMaker\Service;
use Lib\WeaponMaker\Infrastructure\WeaponEffectDbContext;
use PDO;

class GetWeaponService
{
    public function __construct(
        private WeaponEffectDbContext $db
    ) {
    }

    public function getWeapons(): array
    {
        return $this->db->fetchWeaponEffects();
    }
}
