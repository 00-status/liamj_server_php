import './dungeon-floor-tracker.css';
import { useMemo } from 'react';

import type { GamePhase } from '../domain/reducer';
import type { DungeonFloor } from '../domain/types';

type Props = { gamePhase: GamePhase; dungeonFloor: DungeonFloor };

export const DungeonFloorTracker = ({ gamePhase, dungeonFloor }: Props) => {
    const rooms = useMemo(() => {
        console.log('PING!');
        return [
            ...Array(dungeonFloor.roomCount)
                .keys()
                .map((index) => index + 1),
        ];
    }, [dungeonFloor.roomCount]);

    return (
        <div className="dungeon-floor-tracker">
            {rooms.map((roomNumber) => {
                return (
                    <div
                        style={{ color: dungeonFloor.currentRoom === roomNumber ? 'red' : 'white' }}
                        key={`${roomNumber}-dungeon-room`}
                    >
                        {roomNumber}
                    </div>
                );
            })}
        </div>
    );
};
