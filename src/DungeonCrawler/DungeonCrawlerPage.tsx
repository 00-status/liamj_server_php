import { useEffect, useMemo, useReducer, useRef, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';
import { Card } from '../SharedComponents/Card/Card';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterFormation/MonsterStats';
import { CharacterEquipment } from './components/CharacterEquipment';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Ability, Combatant, CombatEvent } from './domain/types';
import { PlayerFormation } from './components/PlayerFormation/PlayerFormation';

// TODO in #64: Add animations.
//      Create an "attack" animation, which nudges characters forward when they deal magic or physical damage.
// TODO in #51: Add Log Messages back in.
const DungeonCrawlerPage = () => {
    const [state, dispatch] = useReducer(dungeonCrawlerReducer, dungeonCrawlerInitialState);
    const { phase, roomsClearedCount, playerFormation, monsterFormation, combatLog, combatEvents } =
        state;

    const [selectedPlayerCharacterID, setSelectedPlayerCharacterID] = useState<string | null>(null);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);
    const pendingAnimationsRef = useRef<Set<string>>(new Set());

    const selectedPlayerCharacter = playerFormation.combatants.find(
        (combatant) => combatant.id === selectedPlayerCharacterID,
    );

    const activeCombatEvent: CombatEvent | undefined = useMemo(() => {
        return combatEvents.find((event) => !event.isProcessed);
    }, [combatEvents]);

    useEffect(() => {
        if (phase === GamePhase.ENEMY_TURN) {
            dispatch({ type: 'ENEMY_USES_ABILITY' });
            return;
        }

        return;
    }, [phase, combatEvents]);

    useEffect(() => {
        if (
            (phase !== GamePhase.ENEMY_EXECUTES && phase !== GamePhase.PLAYER_EXECUTES) ||
            !activeCombatEvent
        ) {
            return;
        }

        if (activeCombatEvent.targetCombatantIDs.length <= 0) {
            dispatch({ type: 'PROCESS_NEXT_EVENT' });
            return;
        }

        pendingAnimationsRef.current = new Set([...activeCombatEvent.targetCombatantIDs]);
    }, [phase, activeCombatEvent]);

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

    const onAnimationComplete = (combatantID: string) => {
        pendingAnimationsRef.current.delete(combatantID);

        if (pendingAnimationsRef.current.size <= 0) {
            dispatch({ type: 'PROCESS_NEXT_EVENT' });
        }
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
                        activeCombatEvent={activeCombatEvent}
                        onAnimationComplete={onAnimationComplete}
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
                        activeCombatEvent={activeCombatEvent}
                        onAnimationComplete={onAnimationComplete}
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
