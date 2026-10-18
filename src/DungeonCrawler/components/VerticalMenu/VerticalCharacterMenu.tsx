import { useState } from 'react';

import { Card } from '../../../SharedComponents/Card/Card';
import { Character, Equipment, LogMessage } from '../../domain/types';

import { PlayerInventory } from './PlayerInventory';

enum MenuState {
    STATS,
    INV,
    LOG,
}

type Props = {
    combatLog: LogMessage[];
    playerInventory: Equipment[];
    playerWealth: number;
    playerCharacters: Character[];
    purchasedEquipment: Equipment[];
};

export const VerticalCharacterMenu = ({
    combatLog,
    playerInventory,
    playerWealth,
    playerCharacters,
}: Props) => {
    const [currentMenuState, setCurrentMenuState] = useState<MenuState>(MenuState.STATS);

    return (
        <div>
            <div>
                <button onClick={() => setCurrentMenuState(MenuState.STATS)}>Stats</button>
                <button onClick={() => setCurrentMenuState(MenuState.INV)}>Inv</button>
                <button onClick={() => setCurrentMenuState(MenuState.LOG)}>Log</button>
            </div>
            <div>
                {currentMenuState === MenuState.INV && (
                    <PlayerInventory
                        equippables={playerInventory}
                        wealth={playerWealth}
                        playerCharacters={playerCharacters}
                    />
                )}
                {currentMenuState === MenuState.LOG && (
                    <Card title="Log">
                        <div>
                            {combatLog.map((log) => (
                                <p key={log.id}>{log.message}</p>
                            ))}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
};
