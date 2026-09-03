import { Character } from '../types';

const DEFENCE_SCALING_FACTOR = 100;
const MAGIC_DEFENCE_SCALING_FACTOR = 100;

export const calculateDefence = (character: Character): number => {
    return Math.round(DEFENCE_SCALING_FACTOR / (DEFENCE_SCALING_FACTOR + character.stats.defence));
};

export const calculateMagicDefence = (character: Character): number => {
    return Math.round(
        MAGIC_DEFENCE_SCALING_FACTOR / (MAGIC_DEFENCE_SCALING_FACTOR + character.stats.defence),
    );
};
