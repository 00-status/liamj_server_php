import { WeaponBuilder } from './WeaponBuilder';
import { DamageType, DiceType, Rarity, WeaponProperties } from './constants';

describe('WeapobBuilder', () => {
    it('should return a weapon class', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder
            .addName('Test Weapon Name')
            .addRarity(Rarity.Legendary)
            .addBaseWeaponProperties('Greatsword')
            .addAdditionalDamage({
                diceCount: 2,
                diceType: DiceType.eight,
                damageType: DamageType.Lightning,
            })
            .addActions(['Test Action']);

        const weapon = weaponBuilder.buildWeapon();

        expect(weapon.getName()).toEqual('Test Weapon Name');
        expect(weapon.getRarity()).toEqual(Rarity.Legendary);
        expect(weapon.getBaseDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.six,
            damageType: DamageType.Slashing,
        });
        expect(weapon.getAdditionalDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.eight,
            damageType: DamageType.Lightning,
        });
        expect(weapon.getWeaponProperties()).toEqual([WeaponProperties.Twohanded]);
        expect(weapon.getRange()).toEqual(null);
        expect(weapon.getActions()).toEqual(['Test Action']);
    });

    it('should return a weapon class when additional damage is null', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder
            .addName('Test Weapon Name')
            .addRarity(Rarity.Legendary)
            .addBaseWeaponProperties('Greatsword')
            .addActions(['Test Action']);

        const weapon = weaponBuilder.buildWeapon();

        expect(weapon.getName()).toEqual('Test Weapon Name');
        expect(weapon.getRarity()).toEqual(Rarity.Legendary);
        expect(weapon.getBaseDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.six,
            damageType: DamageType.Slashing,
        });
        expect(weapon.getAdditionalDamage()).toEqual(null);
        expect(weapon.getWeaponProperties()).toEqual([WeaponProperties.Twohanded]);
        expect(weapon.getRange()).toEqual(null);
        expect(weapon.getActions()).toEqual(['Test Action']);
    });

    it('should return a weapon class when Actions is empty', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder
            .addName('Test Weapon Name')
            .addRarity(Rarity.Legendary)
            .addBaseWeaponProperties('Greatsword')
            .addAdditionalDamage({
                diceCount: 2,
                diceType: DiceType.eight,
                damageType: DamageType.Lightning,
            })
            .addActions([]);

        const weapon = weaponBuilder.buildWeapon();

        expect(weapon.getName()).toEqual('Test Weapon Name');
        expect(weapon.getRarity()).toEqual(Rarity.Legendary);
        expect(weapon.getBaseDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.six,
            damageType: DamageType.Slashing,
        });
        expect(weapon.getAdditionalDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.eight,
            damageType: DamageType.Lightning,
        });
        expect(weapon.getWeaponProperties()).toEqual([WeaponProperties.Twohanded]);
        expect(weapon.getRange()).toEqual(null);
        expect(weapon.getActions()).toEqual([]);
    });

    it('should throw a TypeError when name is null', () => {
        const weaponBuilder = new WeaponBuilder();

        expect(() => weaponBuilder.buildWeapon()).toThrow('');
    });

    it('should throw a TypeError when name is null', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder.addName('NAME!');

        expect(() => weaponBuilder.buildWeapon()).toThrow('Rarity must be defined!');
    });

    it('should throw a TypeError when baseWeaponDamage is null', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder.addName('Test Weapon Name').addRarity(Rarity.Uncommon);

        expect(() => weaponBuilder.buildWeapon()).toThrow(
            'The base weapon damage must be defined!',
        );
    });

    it('should throw a TypeError when Actions is null', () => {
        const weaponBuilder = new WeaponBuilder();

        weaponBuilder
            .addName('Test Weapon Name')
            .addRarity(Rarity.Legendary)
            .addBaseWeaponProperties('Greatsword');

        expect(() => weaponBuilder.buildWeapon()).toThrow('Actions cannot be null!');
    });

    it('should throw an Error when adding an invalid base weapon', () => {
        const weaponBuilder = new WeaponBuilder();

        expect(() => weaponBuilder.addBaseWeaponProperties('Banana!')).toThrow(
            'Cannot find specified weapon!',
        );
    });
});
