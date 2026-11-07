import type { DungeonFloor } from '../types';

export const incrementDungeonFloorCurrentRoom = (dungeonFloor: DungeonFloor): DungeonFloor => {
    return { ...dungeonFloor, currentRoom: dungeonFloor.currentRoom + 1 };
};
