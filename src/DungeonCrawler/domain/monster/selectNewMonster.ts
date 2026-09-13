import { Character } from '../types';

export const selectNewMonster = (potentialMonsters: Character[]): Character => {
    const selectedIndex = Math.floor(Math.random() * potentialMonsters.length);
    const selectedMonster = potentialMonsters[selectedIndex];

    if (!selectedMonster) {
        throw new Error('Cannot select new monster!');
    }

    return { ...selectedMonster };
};
