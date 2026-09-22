import { useEffect, useReducer, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';
import { Card } from '../SharedComponents/Card/Card';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { CharacterEquipment } from './components/CharacterEquipment';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Ability, Combatant } from './domain/types';
import { PlayerFormation } from './components/PlayerFormation/PlayerFormation';

const DungeonCrawlerPage = () => {
    const [state, dispatch] = useReducer(dungeonCrawlerReducer, dungeonCrawlerInitialState);
    const { phase, roomsClearedCount, playerFormation, monsterFormation, combatLog } = state;

    const [selectedPlayerCharacterID, setSelectedPlayerCharacterID] = useState<string | null>(null);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

    const selectedPlayerCharacter = playerFormation.combatants.find(
        (combatant) => combatant.id === selectedPlayerCharacterID,
    );

    useEffect(() => {
        if (phase === GamePhase.ENEMY_EXECUTES) {
            const timer = setTimeout(() => {
                // TODO: Replace with individual animations per each action taken on the enemy's turn.
                dispatch({ type: 'FINISH_EXECUTION' });
            }, 2000);

            return () => clearTimeout(timer);
        }

        if (phase === GamePhase.ENEMY_TURN) {
            dispatch({ type: 'ENEMY_USES_ABILITY' });
            return;
        }

        return;
    }, [phase]);

    useEffect(() => {}, [state.phase]);

    const onPlayerAbilitySelect = (ability: Ability) => {
        if (ability.name === selectedAbility?.name) {
            setSelectedAbility(null);
            return;
        }

        setSelectedAbility(ability);
    };

    const onTargetSelect = (target: Combatant) => {
        if (!selectedAbility || !selectedPlayerCharacter) {
            return;
        }

        dispatch({
            type: 'PLAYER_USES_ABILITY',
            caster: selectedPlayerCharacter,
            target,
            ability: selectedAbility,
        });
        setSelectedAbility(null);
    };

    const toggleEquipmentActive = (equippableName: string) => {
        if (!selectedPlayerCharacter) {
            return;
        }

        dispatch({
            type: 'PLAYER_TOGGLES_EQUIPMENT',
            combatantID: selectedPlayerCharacter.id,
            equippableName,
        });
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {phase === GamePhase.GAME_OVER && <div>Game Over!</div>}
            {phase !== GamePhase.GAME_OVER && (
                <div className="dungeon-crawler-page">
                    <div className="dungeon-crawler-page__room_count">{roomsClearedCount}</div>
                    <MonsterStats
                        formation={monsterFormation}
                        currentAbility={selectedAbility}
                        currentPlayer={selectedPlayerCharacter || null}
                        onEnemySelect={onTargetSelect}
                    />
                    <PlayerFormation
                        formation={playerFormation}
                        canPlayerTakeActions={
                            phase === GamePhase.PLAYER_TURN &&
                            !!selectedPlayerCharacter &&
                            selectedPlayerCharacter.character.currentHP > 0
                        }
                        currentPlayer={selectedPlayerCharacter || null}
                        currentAbility={selectedAbility}
                        onPlayerSelect={(combatantID: string) =>
                            setSelectedPlayerCharacterID(combatantID)
                        }
                        onPlayerAbility={onPlayerAbilitySelect}
                        onTargetCombatant={onTargetSelect}
                    />
                    <Card title="Log">
                        <div>
                            {combatLog.map((log) => (
                                <p key={log.id}>{log.message}</p>
                            ))}
                        </div>
                    </Card>
                    {!!selectedPlayerCharacter &&
                        !!selectedPlayerCharacter.character.equipables.length && (
                            <CharacterEquipment
                                equippables={selectedPlayerCharacter.character.equipables}
                                toggleEquipmentActive={toggleEquipmentActive}
                            />
                        )}
                </div>
            )}
        </Page>
    );
};

export default DungeonCrawlerPage;
