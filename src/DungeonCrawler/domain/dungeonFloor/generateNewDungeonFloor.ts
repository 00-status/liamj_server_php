import type { DungeonFloor } from '../types';

const ROOM_DISTRIBUTION = [
    { maxRoll: 0.05, roomCount: 2 },
    { maxRoll: 0.45, roomCount: 3 },
    { maxRoll: 0.75, roomCount: 4 },
    { maxRoll: 0.95, roomCount: 5 },
    { maxRoll: 1.0, roomCount: 6 },
] as const;

export const generateNewDungeonFloor = (): DungeonFloor => {
    const roomRoll = Math.random();

    const match = ROOM_DISTRIBUTION.find((entry) => roomRoll < entry.maxRoll);
    const roomCount = match ? match.roomCount : 6;

    return {
        id: crypto.randomUUID(),
        roomCount,
        currentRoom: 1,
    };
};
