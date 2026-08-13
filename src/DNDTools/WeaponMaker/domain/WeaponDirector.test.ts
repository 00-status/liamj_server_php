import { createWeapon } from './WeaponDirector';
import { DamageType, DiceType, Rarity, baseWeapons } from './constants';

describe('WeaponDirector', () => {
    beforeEach(() => {
        jest.spyOn(globalThis.Math, 'random').mockReturnValue(0.0);
    });

    it('should generate a weapon completely randomly', () => {
        const result = createWeapon(Rarity.Legendary);

        expect(result.getName()).toEqual('Battleaxe');
        expect(result.getBaseDamage()).toEqual(baseWeapons[0].damage);
        expect(result.getWeaponProperties()).toEqual(baseWeapons[0].properties);
        expect(result.getAdditionalDamage()).toEqual({
            diceCount: 2,
            diceType: DiceType.ten,
            damageType: DamageType.Radiant,
        });
        expect(result.getActions()).toEqual([
            'This weapon can be thrown up to 60ft. On impact, it explodes in a 20ft radius. Each Creature within range must make a DC 15 Dexterity Saving Throw or take 8d6 Fire Damage. The weapon is destroyed when used in this way',
        ]);
    });
});
