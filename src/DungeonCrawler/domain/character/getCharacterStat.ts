import { BaseStatNames, Character, StatModifier } from '../types';

export const getCharacterStat = (character: Character, stat: BaseStatNames): number => {
    const modifiers: StatModifier[] = [
        ...character.modifiers,
        ...character.equipables.reduce<StatModifier[]>((acc, equipment) => {
            acc = [...acc, ...equipment.modifiers];
            return acc;
        }, []),
    ].filter((modifier) => modifier.stat === stat);

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
