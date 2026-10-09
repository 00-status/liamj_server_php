import { useEffect, useMemo, useReducer, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';
import { Card } from '../SharedComponents/Card/Card';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterFormation/MonsterStats';
import { CharacterEquipment } from './components/CharacterEquipment';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Ability, Combatant, CombatEvent } from './domain/types';
import { PlayerFormation } from './components/PlayerFormation/PlayerFormation';
import { getCombatEventDuration } from './domain/combatEvents/getAnimationData';
import { DungeonShop } from './components/DungeonShop';

// Shop component 🟡
//      List of purchasable Equipment. ✅
//      When an item is purchased, it is added to the player's inventory. ✅
//      Pressing a "Continue Journey" button will load up the next room. ✅
// PlayerEquipment component
//      Positioned below the player's stats ✅
//      Three dropdowns (armour, weapon, trinket). ✅
//      The player can equip any non-equipped item from the inventory. 🟡
// Equipment -> Inventory 🔴
//      Contains a list of all acquired equipment.
//      Says who has equipped which item.
// wealth: number;
// Inventory: Equipment[];

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

    const onEquipmentSelect = (
        previousEquippableID: string | null,
        newEquippableID: string,
        characterID: string,
    ) => {
        dispatch({
            type: 'PLAYER_TOGGLES_EQUIPMENT',
            characterID,
            previousEquippableID,
            newEquippableID,
        });
    };

    const onPlayerPurchase = (equippableID: string) => {
        dispatch({ type: 'PURCHASE_ITEM', itemID: equippableID });
    };

    const onPlayerLeaveShop = () => {
        dispatch({ type: 'LEAVE_SHOP' });
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
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
                        onEquipmentSelect={onEquipmentSelect}
                    />
                    <Card title="Log">
                        <div>
                            {combatLog.map((log) => (
                                <p key={log.id}>{log.message}</p>
                            ))}
                        </div>
                    </Card>
                    <CharacterEquipment equippables={playerInventory} />
                </div>
            )}
        </Page>
    );
};

export default DungeonCrawlerPage;
