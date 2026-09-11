import { BaseStatNames, Character } from '../types';

import { getCharacterStat } from './getCharacterStat';

const DEFENCE_SCALING_FACTOR = 100;
const MAGIC_DEFENCE_SCALING_FACTOR = 100;

export const calculateDefence = (character: Character): number => {
    return (
        DEFENCE_SCALING_FACTOR /
        (DEFENCE_SCALING_FACTOR + getCharacterStat(character, BaseStatNames.defence))
    );
};

export const calculateMagicDefence = (character: Character): number => {
    return (
        MAGIC_DEFENCE_SCALING_FACTOR /
        (MAGIC_DEFENCE_SCALING_FACTOR + getCharacterStat(character, BaseStatNames.magicDefence))
    );
};
