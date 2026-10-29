import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './vertical-character-menu.css';
import type { Character, Equipment, LogMessage } from '../../domain/types';
import { DungeonButton, DungeonButtonTheme } from '../DungeonButton';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

import { PlayerInventory } from './PlayerInventory';
import { CharacterStatCard } from './CharacterStatCard';
import { CombatLogItem } from './CombatLogItem';

enum MenuState {
    STATS,
    INV,
    LOG,
    CONFIG,
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
    const navigate = useNavigate();
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
                        onClick={() => setCurrentMenuState(MenuState.CONFIG)}
                        buttonTheme={
                            currentMenuState === MenuState.CONFIG
                                ? DungeonButtonTheme.ACTIVE
                                : DungeonButtonTheme.DEFAULT
                        }
                    >
                        <Icon iconType={IconType.GEARS} />
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
                        onClick={() => setCurrentMenuState(MenuState.STATS)}
                        buttonTheme={
                            currentMenuState === MenuState.STATS
                                ? DungeonButtonTheme.ACTIVE
                                : DungeonButtonTheme.DEFAULT
                        }
                    >
                        Stats
                    </DungeonButton>
                </div>
                <div className="vertical-character-menu__container">
                    {currentMenuState === MenuState.CONFIG && (
                        <div className="vertical-character-menu__config">
                            <DungeonButton onClick={() => navigate('/')}>
                                Back to Main Site
                            </DungeonButton>
                        </div>
                    )}
                    {currentMenuState === MenuState.LOG && (
                        <div>
                            {combatLog.map((log) => (
                                <CombatLogItem key={log.id} log={log} />
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
                </div>
            </div>
        </>
    );
};
