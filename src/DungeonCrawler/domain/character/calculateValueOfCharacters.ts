import type { MonsterCharacter } from '../types';

export const calculateValueOfCharacters = (monsters: MonsterCharacter[]): number => {
    return monsters.reduce((totalWealth, monster) => {
        return totalWealth + monster.threatScore;
    }, 0);
};
