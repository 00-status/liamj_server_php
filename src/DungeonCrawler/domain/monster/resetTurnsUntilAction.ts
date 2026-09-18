import { getRandomInt } from '../utiils';

export const resetTurnsUntilAction = (): number => {
    return getRandomInt(1, 4);
};
