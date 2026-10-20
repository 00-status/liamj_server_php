import { useState } from 'react';

import './vertical-character-menu.css';
import { Character, Equipment, LogMessage } from '../../domain/types';
import { DungeonButton } from '../DungeonButton';

import { PlayerInventory } from './PlayerInventory';
import { CharacterStatCard } from './CharacterStatCard';

enum MenuState {
    STATS,
    INV,
    LOG,
}

type Props = {
    isOpen: boolean;
    toggleIsOpen: (value: boolean) => void;
    combatLog: LogMessage[];
    playerWealth: number;
    playerCharacters: Character[];
    purchasedEquipment: Equipment[];
};

// TODO: Change the colour of the active menu button.

export const VerticalCharacterMenu = ({
    isOpen,
    toggleIsOpen,
    combatLog,
    playerWealth,
    playerCharacters,
    purchasedEquipment,
}: Props) => {
    const [currentMenuState, setCurrentMenuState] = useState<MenuState>(MenuState.STATS);

    return (
        <>
            <div
                className={`vertical-character-menu__overlay ${isOpen ? 'vertical-character-menu__overlay--open' : ''}`}
                onClick={() => toggleIsOpen(!isOpen)}
            />
            <div
                className={`vertical-character-menu ${isOpen ? 'vertical-character-menu__open' : ''}`}
            >
                <div className="vertical-character-menu__buttons">
                    <DungeonButton onClick={() => setCurrentMenuState(MenuState.STATS)}>
                        Stats
                    </DungeonButton>
                    <DungeonButton onClick={() => setCurrentMenuState(MenuState.INV)}>
                        Inv
                    </DungeonButton>
                    <DungeonButton onClick={() => setCurrentMenuState(MenuState.LOG)}>
                        Log
                    </DungeonButton>
                </div>
                <div className="vertical-character-menu__container">
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
                        <div>
                            {combatLog.map((log) => (
                                <p key={log.id}>{log.message}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
