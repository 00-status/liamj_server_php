import './dungeon-floor-tracker.css';
import { useMemo } from 'react';

import { GamePhase } from '../domain/reducer';
import type { DungeonFloor } from '../domain/types';
import { Icon } from '../../SharedComponents/Icon/Icon';
import { IconType } from '../../SharedComponents/Icon/domain';

type Props = { gamePhase: GamePhase; dungeonFloor: DungeonFloor };

export const DungeonFloorTracker = ({ gamePhase, dungeonFloor }: Props) => {
    const rooms = useMemo(() => {
        return [
            ...Array(dungeonFloor.roomCount)
                .keys()
                .map((index) => index + 1),
        ];
    }, [dungeonFloor.roomCount]);

    return (
        <div className="dungeon-floor-tracker">
            {gamePhase === GamePhase.SHOPPING && (
                <div className="dungeon-floor-tracker__room dungeon-floor-tracker__room--active">
                    <Icon iconType={IconType.STORE} />
                </div>
            )}
            {gamePhase !== GamePhase.SHOPPING &&
                rooms.map((roomNumber) => {
                    const isCurrentRoom = dungeonFloor.currentRoom === roomNumber;
                    const isRoomCompleted = dungeonFloor.currentRoom > roomNumber;

                    let modifierClass = '';
                    if (isCurrentRoom) {
                        modifierClass = 'dungeon-floor-tracker__room--active';
                    } else if (isRoomCompleted) {
                        modifierClass = 'dungeon-floor-tracker__room--completed';
                    }

                    return (
                        <div
                            className={`dungeon-floor-tracker__room ${modifierClass}`}
                            key={`${roomNumber}-dungeon-room`}
                        >
                            {isCurrentRoom && <Icon iconType={IconType.SWORDS} />}
                        </div>
                    );
                })}
        </div>
    );
};
