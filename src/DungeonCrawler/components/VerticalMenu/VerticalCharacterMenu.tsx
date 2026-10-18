import { useState } from 'react';

import { Card } from '../../../SharedComponents/Card/Card';
import { Character, Equipment, LogMessage } from '../../domain/types';

import { PlayerInventory } from './PlayerInventory';
import { CharacterStatCard } from './CharacterStatCard';

enum MenuState {
    STATS,
    INV,
    LOG,
}

type Props = {
    combatLog: LogMessage[];
    playerWealth: number;
    playerCharacters: Character[];
    purchasedEquipment: Equipment[];
};

export const VerticalCharacterMenu = ({
    combatLog,
    playerWealth,
    playerCharacters,
    purchasedEquipment,
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
                {currentMenuState === MenuState.STATS &&
                    playerCharacters.map((playerCharacter) => (
                        <CharacterStatCard
                            key={`stat-card-${playerCharacter.id}`}
                            character={playerCharacter}
                            purchasedEquipment={purchasedEquipment}
                        />
                    ))}
                {currentMenuState === MenuState.INV && (
                    <PlayerInventory
                        equippables={purchasedEquipment}
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
