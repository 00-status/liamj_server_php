import type { DungeonFloor } from '../types';

export const isDungeonFloorCompleted = (dungeonFloor: DungeonFloor | null): boolean => {
    if (!dungeonFloor) {
        return false;
    }

    return dungeonFloor.currentRoom >= dungeonFloor.roomCount;
};
