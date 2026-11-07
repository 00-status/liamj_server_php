import type { DungeonFloor } from '../types';

export const generateNewDungeonFloor = (): DungeonFloor => {
    return { id: crypto.randomUUID(), roomCount: 4, currentRoom: 1 };
};
