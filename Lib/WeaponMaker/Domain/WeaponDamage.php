<?php
namespace Lib\WeaponMaker\Domain;

class WeaponDamage
{
    private int $dice_count;
    private int $dice_type;
    private string $damage_type;

    public function __construct(
        int $dice_count,
        int $dice_type,
        string $damage_type
    ) {
        $this->dice_count = $dice_count;
        $this->dice_type = $dice_type;
        $this->damage_type = $damage_type;
    }

    public function getDiceCount(): int
    {
        return $this->dice_count;
    }

    public function getDiceType(): int
    {
        return $this->dice_type;
    }

    public function getDamageType(): string
    {
        return $this->damage_type;
    }
}
