export type Weapon = {
    id: number;
    defaultName: string;
    name: string | null;
    rarity: string;
    properties: string[];
    baseDamage: WeaponDamage;
    extraDamage: WeaponDamage;
    weaponEffect: WeaponEffect;
    effectiveRange: number;
    ineffectiveRange: number;
};

export type WeaponDamage = {
    diceCount: number;
    diceType: number;
    damageType: string;
};

export type WeaponEffect = {
    id: number;
    name: string;
    description: string;
    rarities: string[];
    tags: string[];
};
