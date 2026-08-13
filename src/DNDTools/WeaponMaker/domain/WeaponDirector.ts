import { Weapon } from './Weapon';
import { WeaponBuilder } from './WeaponBuilder';
import {
    DamageType,
    DiceType,
    Rarity,
    baseWeapons,
    damageTypes,
    diceCounts,
    diceTypes,
    weaponActions,
} from './constants';
import { getRarities } from './domain';

export const createWeapon = (selectedRarity: Rarity): Weapon => {
    // TODO: Randomly select a couple actions based on rarity.
    //      Pick 0-2 actions based ono rarity

    let rarities: Rarity[] = getRarities(selectedRarity);

    const baseWeapon = baseWeapons[Math.floor(Math.random() * baseWeapons.length)];
    const weaponBuilder = new WeaponBuilder();

    weaponBuilder
        .addName(baseWeapon.name)
        .addRarity(selectedRarity)
        .addBaseWeaponProperties(baseWeapon.name);

    const diceCount = getDiceCount(rarities);
    const diceType = getDiceType(rarities);
    const damageType = getDamageType(rarities);

    weaponBuilder.addAdditionalDamage({
        diceCount: diceCount,
        diceType: diceType,
        damageType: damageType,
    });

    const action = weaponActions[Math.floor(Math.random() * weaponActions.length)];
    weaponBuilder.addActions([action.effect]);

    return weaponBuilder.buildWeapon();
};

const getRarity = (rarities: Rarity[]): Rarity | null => {
    if (rarities.length <= 0) {
        return null;
    }

    const rarityIndex = Math.floor(Math.random() * rarities.length);
    return rarities.splice(rarityIndex, 1)[0];
};

const getDiceCount = (rarities: Rarity[]): number => {
    const rarity = getRarity(rarities);

    const filteredDiceCounts = diceCounts.filter((diceCount) => {
        return diceCount.rarity === rarity;
    });

    return filteredDiceCounts[Math.floor(Math.random() * filteredDiceCounts.length)].diceCount;
};

const getDiceType = (rarities: Rarity[]): number => {
    const rarity = getRarity(rarities);

    const filteredDiceTypes = diceTypes.filter((diceType) => {
        return diceType.rarity === rarity;
    });

    if (filteredDiceTypes.length <= 0) {
        return DiceType.six;
    }

    return filteredDiceTypes[Math.floor(Math.random() * filteredDiceTypes.length)].diceType;
};

const getDamageType = (rarities: Rarity[]): DamageType => {
    const rarity = getRarity(rarities);

    const filteredDamageTypes = damageTypes.filter((damageType) => {
        return damageType.rarity === rarity;
    });

    return filteredDamageTypes[Math.floor(Math.random() * filteredDamageTypes.length)].damageType;
};
