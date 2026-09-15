import { BaseStatNames, Character, DynamicStatModifier } from '../types';

export const getCharacterStat = (character: Character, stat: BaseStatNames): number => {
    const equipableModifiers = character.equipables.reduce<DynamicStatModifier[]>(
        (acc, equipment) => {
            if (equipment.active) {
                acc = [...acc, ...equipment.modifiers];
            }
            return acc;
        },
        [],
    );

    const modifiers: DynamicStatModifier[] = [...character.modifiers, ...equipableModifiers].filter(
        (modifier) => modifier.stat === stat,
    );

    // Ensure Flat values are applied first
    modifiers.sort((e1) => (e1.type === 'flat' ? -1 : 1));

    let statAcc = character.stats[stat];
    modifiers.forEach((modifier) => {
        if (modifier.type === 'flat') {
            statAcc += modifier.value;
        } else {
            statAcc *= modifier.value;
        }
    });

    statAcc = Math.round(statAcc);
    return statAcc;
};
