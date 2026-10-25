import { useState } from 'react';

import './vertical-character-menu.css';
import { Character, Equipment, LogMessage } from '../../domain/types';
import { DungeonButton, DungeonButtonTheme } from '../DungeonButton';

import { PlayerInventory } from './PlayerInventory';
import { CharacterStatCard } from './CharacterStatCard';
import { CombatLogItem } from './CombatLogItem';

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
    onEquipmentSelect: (
        previousEquippableID: string | null,
        newEquippableID: string | null,
        characterID: string,
    ) => void;
};

export const VerticalCharacterMenu = ({
    isOpen,
    toggleIsOpen,
    combatLog,
    playerWealth,
    playerCharacters,
    purchasedEquipment,
    onEquipmentSelect,
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
                    <DungeonButton
                        onClick={() => setCurrentMenuState(MenuState.STATS)}
                        buttonTheme={
                            currentMenuState === MenuState.STATS
                                ? DungeonButtonTheme.ACTIVE
                                : DungeonButtonTheme.DEFAULT
                        }
                    >
                        Stats
                    </DungeonButton>
                    <DungeonButton
                        onClick={() => setCurrentMenuState(MenuState.INV)}
                        buttonTheme={
                            currentMenuState === MenuState.INV
                                ? DungeonButtonTheme.ACTIVE
                                : DungeonButtonTheme.DEFAULT
                        }
                    >
                        Inv
                    </DungeonButton>
                    <DungeonButton
                        onClick={() => setCurrentMenuState(MenuState.LOG)}
                        buttonTheme={
                            currentMenuState === MenuState.LOG
                                ? DungeonButtonTheme.ACTIVE
                                : DungeonButtonTheme.DEFAULT
                        }
                    >
                        Log
                    </DungeonButton>
                </div>
                <div className="vertical-character-menu__container">
                    {currentMenuState === MenuState.STATS && (
                        <div>
                            {playerCharacters.map((playerCharacter) => (
                                <CharacterStatCard
                                    key={`stat-card-${playerCharacter.id}`}
                                    character={playerCharacter}
                                    purchasedEquipment={purchasedEquipment}
                                    onEquipmentSelect={onEquipmentSelect}
                                />
                            ))}
                        </div>
                    )}
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
                                <CombatLogItem key={log.id} log={log} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
