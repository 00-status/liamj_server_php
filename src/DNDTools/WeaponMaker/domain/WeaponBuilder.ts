import { Weapon } from './Weapon';
import { Rarity, WeaponDamage, WeaponProperties, WeaponRange, baseWeapons } from './constants';

export class WeaponBuilder {
    private name: string | null = null;
    private rarity: Rarity | null = null;
    private baseDamage: WeaponDamage | null = null;
    private additionalDamage: WeaponDamage | null = null;
    private weaponProperties: WeaponProperties[] | null = null;
    private weaponRange: WeaponRange | null = null;
    private actions: string[] | null = null;

    public addName(name: string): this {
        this.name = name;
        return this;
    }

    public addRarity(rarity: Rarity): this {
        this.rarity = rarity;
        return this;
    }

    public addBaseWeaponProperties(weapon: string) {
        const baseWeapon = baseWeapons.find((baseWeapon) => {
            return baseWeapon.name === weapon;
        });

        if (!baseWeapon) {
            throw new Error('Cannot find specified weapon!');
        }

        this.baseDamage = { ...baseWeapon.damage };
        this.weaponProperties = [...baseWeapon.properties];

        return this;
    }

    public addAdditionalDamage(additionalDamage: WeaponDamage): this {
        this.additionalDamage = additionalDamage;
        return this;
    }

    public addActions(actions: string[]): this {
        this.actions = actions;
        return this;
    }

    public buildWeapon(): Weapon {
        if (!this.name) {
            throw new TypeError('Name must be defined!');
        }

        if (!this.rarity) {
            throw new TypeError('Rarity must be defined!');
        }

        if (!this.baseDamage) {
            throw new TypeError('The base weapon damage must be defined!');
        }

        if (this.weaponProperties === null) {
            throw new TypeError('Weapon properties cannot be null!');
        }

        if (this.actions === null) {
            throw new TypeError('Actions cannot be null!');
        }

        return new Weapon(
            this.name,
            this.rarity,
            this.baseDamage,
            this.additionalDamage,
            this.weaponProperties,
            this.weaponRange,
            this.actions,
        );
    }
}
