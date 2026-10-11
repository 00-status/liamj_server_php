import { BaseStatModifier, BaseStatNames, Character, DamageScaleMethod, Equipment } from '../types';

export const getCharacterStat = (
    character: Character,
    characterEquippables: Equipment[],
    stat: BaseStatNames,
): number => {
    const equippableModifiers = characterEquippables.reduce<BaseStatModifier[]>(
        (acc, equipment) => {
            acc = [...acc, ...equipment.modifiers];
            return acc;
        },
        [],
    );

    const modifiers: BaseStatModifier[] = [...character.modifiers, ...equippableModifiers].filter(
        (modifier) => modifier.stat === stat,
    );

    // Ensure Flat values are applied first
    modifiers.sort((a, b) => {
        if (a.type === b.type) {
            return 0;
        }

        return a.type === DamageScaleMethod.FLAT ? -1 : 1;
    });

    let statAcc = character.stats[stat];
    modifiers.forEach((modifier) => {
        if (modifier.type === DamageScaleMethod.FLAT) {
            statAcc += modifier.value;
        } else {
            statAcc *= modifier.value;
        }
    });

    statAcc = Math.round(statAcc);
    return statAcc;
};
