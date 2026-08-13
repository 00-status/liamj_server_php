import { Rarity, WeaponDamage, WeaponProperties, WeaponRange } from './constants';

export class Weapon {
    private name: string;
    private rarity: Rarity;
    private baseDamage: WeaponDamage;
    private additionalDamage: WeaponDamage | null;
    private weaponProperties: WeaponProperties[];
    private weaponRange: WeaponRange | null;
    private actions: string[];

    constructor(
        name: string,
        rarity: Rarity,
        baseDamage: WeaponDamage,
        additionalDamage: WeaponDamage | null,
        weaponProperties: WeaponProperties[],
        weaponRange: WeaponRange | null,
        actions: string[],
    ) {
        this.name = name;
        this.rarity = rarity;
        this.baseDamage = baseDamage;
        this.additionalDamage = additionalDamage;
        this.weaponProperties = weaponProperties;
        this.weaponRange = weaponRange;
        this.actions = actions;
    }

    public getName(): string {
        return this.name;
    }

    public getRarity(): Rarity {
        return this.rarity;
    }

    public getBaseDamage(): WeaponDamage {
        return this.baseDamage;
    }

    public getAdditionalDamage(): WeaponDamage | null {
        return this.additionalDamage;
    }

    public getWeaponProperties(): WeaponProperties[] {
        return this.weaponProperties;
    }

    public getRange(): WeaponRange | null {
        return this.weaponRange;
    }

    public getActions(): string[] {
        return this.actions;
    }
}
