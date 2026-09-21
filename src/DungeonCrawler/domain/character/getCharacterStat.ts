import { BaseStatModifier, BaseStatNames, Character } from '../types';

export const getCharacterStat = (character: Character, stat: BaseStatNames): number => {
    const equipableModifiers = character.equipables.reduce<BaseStatModifier[]>((acc, equipment) => {
        if (equipment.active) {
            acc = [...acc, ...equipment.modifiers];
        }
        return acc;
    }, []);

    const modifiers: BaseStatModifier[] = [...character.modifiers, ...equipableModifiers].filter(
        (modifier) => modifier.stat === stat,
    );

    // Ensure Flat values are applied first
    modifiers.sort((a, b) => {
        if (a.type === b.type) {
            return 0;
        }

        return a.type === 'flat' ? -1 : 1;
    });

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
