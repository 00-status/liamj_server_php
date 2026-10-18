import { useEffect, useMemo, useReducer, useState } from 'react';

import './dungeon-crawler-page.css';
import { Icon } from '../SharedComponents/Icon/Icon';
import { IconType } from '../SharedComponents/Icon/domain';

import { MonsterStats } from './components/MonsterFormation/MonsterStats';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Combatant } from './domain/Combatant';
import { Ability, CombatEvent } from './domain/types';
import { PlayerFormation } from './components/PlayerFormation/PlayerFormation';
import { getCombatEventDuration } from './domain/combatEvents/getAnimationData';
import { DungeonShop } from './components/DungeonShop';
import { VerticalCharacterMenu } from './components/VerticalMenu/VerticalCharacterMenu';

// Vertical Menu that holds some sub-menus 🟡
//      Stats menu, Inventory Menu, and Log Menu ✅
//      Clicking on an icon navigates to a particular menu. ✅
//      On Mobile the menu is hidden and only pops out when a button is pressed. ✅
//      On Desktop the menu is always visible and takes up about 25% of the screen. ✅
// Stats Menu 🟡
//      Lists each player-character in the game.
//      Each item displays the character's Current Hit Points, Max Hit Points, Magic Points, Max Magic Points, Attack, Magic Attack, Defence, Magic Defence, Crit Chance
//      TODO: Change the colour of modified stats.
//      TODO: Change the colour of Attack, Magic Attack, and Crit Chance
// Inventory Menu
//      Displays purchased Items ✅
//      TODO: The Player can assign Items to their character here. 🔴
// Log Menu (To be done in #51)
//      Displays a log of combat so far.

// TODO in #51: Add Log Messages back in.
const DungeonCrawlerPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
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

    if (phase === GamePhase.GAME_OVER) {
        return <div>Game Over!</div>;
    }

    return (
        <>
            <button onClick={() => setIsMenuOpen((state) => !state)}>
                <Icon iconType={IconType.MENU_BOOK} />
            </button>
            <div className="dungeon-crawler-page">
                <VerticalCharacterMenu
                    isOpen={isMenuOpen}
                    toggleIsOpen={(newValue) => setIsMenuOpen(newValue)}
                    combatLog={combatLog}
                    playerWealth={playerWealth}
                    playerCharacters={playerFormation.combatants.map(
                        (combatant) => combatant.character,
                    )}
                    purchasedEquipment={playerInventory}
                />
                <div className="dungeon-crawler-page__dungeon">
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
            </div>
        </>
    );
};

export default DungeonCrawlerPage;
