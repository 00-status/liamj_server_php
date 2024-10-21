<?php

namespace Lib\WeaponMaker\Domain;

class WeaponBuilder
{
    private ?string $rarity = null;
    private ?string $default_name = null;
    private ?array $properties = null;
    private ?WeaponDamage $base_damage = null;
    private ?int $effective_range = null;
    private ?int $ineffective_range = null;
    private ?string $name = null;
    private ?WeaponDamage $extra_damage = null;
    private ?WeaponEffect $weapon_effect = null;

    public function setRarity(string $rarity): self
    {
        $this->rarity = $rarity;
        return $this;
    }

    public function setBaseWeaponProperties(BaseWeapon $base_weapon): self
    {
        $this->default_name = $base_weapon->getName();
        $this->properties = $base_weapon->getProperties();
        $this->base_damage = $base_weapon->getBaseDamage();
        $this->effective_range = $base_weapon->getEffectiveRange();
        $this->ineffective_range = $base_weapon->getIneffectiveRange();
        return $this;
    }

    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function setExtraDamage(WeaponDamage $weapon_damage): self
    {
        $this->extra_damage = $weapon_damage;
        return $this;
    }

    public function setWeaponEffect(WeaponEffect $weapon_effect): self
    {
        $this->weapon_effect = $weapon_effect;
        return $this;
    }

    public function build(): Weapon
    {
        if ($this->rarity !== null
            && $this->default_name !== null
            && $this->properties !== null
            && $this->base_damage !== null
            && $this->effective_range !== null
            && $this->ineffective_range !== null
            && $this->extra_damage !== null
            && $this->weapon_effect !== null
        ) {
            return new Weapon(
                0,
                $this->default_name,
                $this->name,
                $this->rarity,
                $this->properties,
                $this->base_damage,
                $this->extra_damage,
                $this->weapon_effect,
                $this->effective_range,
                $this->ineffective_range
            );
        } else {
            throw new \InvalidArgumentException("Cannot generate weapon!");
        }
    }
}
