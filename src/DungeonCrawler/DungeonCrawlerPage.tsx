import { useEffect, useMemo, useReducer, useState } from 'react';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterFormation/MonsterStats';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Combatant } from './domain/Combatant';
import { Ability, CombatEvent } from './domain/types';
import { PlayerFormation } from './components/PlayerFormation/PlayerFormation';
import { getCombatEventDuration } from './domain/combatEvents/getAnimationData';
import { DungeonShop } from './components/DungeonShop';

// TODO in #51: Add Log Messages back in.
const DungeonCrawlerPage = () => {
    const [state, dispatch] = useReducer(dungeonCrawlerReducer, dungeonCrawlerInitialState);
    const {
        phase,
        roomsClearedCount,
        playerFormation,
        monsterFormation,
        playerInventory,
        playerWealth,
        combatLog,
        combatEvents,
    } = state;

    const [selectedPlayerCharacterID, setSelectedPlayerCharacterID] = useState<string | null>(null);
    const [selectedAbility, setSelectedAbility] = useState<Ability | null>(null);

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

        const durationMilliseconds = getCombatEventDuration(activeCombatEvent);

        const timer = setTimeout(() => {
            dispatch({ type: 'PROCESS_NEXT_EVENT' });
        }, durationMilliseconds);

        return () => clearTimeout(timer);
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

    // const onEquipmentSelect = (
    //     previousEquippableID: string | null,
    //     newEquippableID: string | null,
    //     characterID: string,
    // ) => {
    //     dispatch({
    //         type: 'PLAYER_TOGGLES_EQUIPMENT',
    //         characterID,
    //         previousEquippableID,
    //         newEquippableID,
    //     });
    // };

    const onPlayerPurchase = (equippableID: string) => {
        dispatch({ type: 'PURCHASE_ITEM', itemID: equippableID });
    };

    const onPlayerLeaveShop = () => {
        dispatch({ type: 'LEAVE_SHOP' });
    };

    return (
        <div>
            {phase === GamePhase.GAME_OVER && <div>Game Over!</div>}
            {phase !== GamePhase.GAME_OVER && (
                <div className="dungeon-crawler-page">
                    <div className="dungeon-crawler-page__room_count">{roomsClearedCount}</div>
                    {phase === GamePhase.SHOPPING && (
                        <DungeonShop
                            purchasedItems={playerInventory}
                            playerWealth={playerWealth}
                            onPlayerPurchase={onPlayerPurchase}
                            onPlayerContinue={onPlayerLeaveShop}
                        />
                    )}
                    {phase !== GamePhase.SHOPPING && (
                        <MonsterStats
                            formation={monsterFormation}
                            currentAbility={selectedAbility}
                            currentPlayer={selectedPlayerCharacter || null}
                            activeCombatEvent={activeCombatEvent}
                            onEnemySelect={onTargetSelect}
                        />
                    )}
                    <PlayerFormation
                        formation={playerFormation}
                        purchasedEquipment={playerInventory}
                        canPlayerTakeActions={
                            phase === GamePhase.PLAYER_TURN &&
                            !!selectedPlayerCharacter &&
                            selectedPlayerCharacter.character.currentHP > 0
                        }
                        currentPlayer={selectedPlayerCharacter || null}
                        currentAbility={selectedAbility}
                        activeCombatEvent={activeCombatEvent}
                        onPlayerSelect={(combatantID: string) =>
                            setSelectedPlayerCharacterID(combatantID)
                        }
                        onPlayerAbility={onPlayerAbilitySelect}
                        onTargetCombatant={onTargetSelect}
                    />
                </div>
            )}
        </div>
    );
};

export default DungeonCrawlerPage;
