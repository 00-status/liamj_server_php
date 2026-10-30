import rawMonsterFormations from '../../assets/monster_formations.json';

import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { examplePlayerFormation } from './constants';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { pickNewMonsterFormation } from './monster/pickNewMonsterFormation';
import type { Ability, CombatEvent, Equipment, LogMessage } from './types';
import { BaseStatNames, CombatEventType, DamageType } from './types';
import { selectTargetForMonster } from './monster/selectTargetForMonster';
import { isFormationDefeated } from './formation/isFormationDefeated';
import { combatEventHandlers } from './combatEvents/combatEventHandlers';
import { generateDamageLogs } from './combatEvents/generateDamageLogs';
import { changePoints } from './character/changePoints';
import { exampleEquippables } from './equippables';
import { shouldPlayerVisitShop } from './formation/shouldPlayerVisitShop';
import { canCharacterEquipItem } from './character/canCharacterEquipItem';
import { calculateValueOfCharacters } from './character/calculateValueOfCharacters';
import { getCharacterStat } from './character/getCharacterStat';
import type { Formation } from './formation/types';
import type { Combatant } from './Combatant';
import { MonsterCombatant } from './Combatant';
import { deserializeFormations } from './formation/deserializeFormations';

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability; caster: Combatant; target: Combatant }
    | { type: 'ENEMY_USES_ABILITY' }
    | { type: 'PROCESS_NEXT_EVENT' }
    | { type: 'FINISH_EXECUTION' }
    | {
          type: 'PLAYER_TOGGLES_EQUIPMENT';
          characterID: string;
          previousEquippableID: string | null;
          newEquippableID: string | null;
      }
    | { type: 'PURCHASE_ITEM'; itemID: string }
    | { type: 'LEAVE_SHOP' };

export enum GamePhase {
    GAME_OVER = 'GAME_OVER',
    PLAYER_TURN = 'PLAYER_TURN',
    PLAYER_EXECUTES = 'PLAYER_EXECUTES',
    ENEMY_TURN = 'ENEMY_TURN',
    ENEMY_EXECUTES = 'ENEMY_EXECUTES',
    SHOPPING = 'SHOPPING',
}

type DungeonCrawlerState = {
    phase: GamePhase;
    roomsClearedCount: number;
    monsterFormation: Formation;
    playerFormation: Formation;
    playerInventory: Equipment[];
    playerWealth: number;
    combatLog: LogMessage[];
    combatEvents: CombatEvent[];
};

const monsterFormations: Formation[] = deserializeFormations(rawMonsterFormations);

export const dungeonCrawlerInitialState: DungeonCrawlerState = {
    phase: GamePhase.SHOPPING,
    roomsClearedCount: 0,
    monsterFormation: pickNewMonsterFormation(monsterFormations),
    playerFormation: examplePlayerFormation,
    playerInventory: [],
    playerWealth: 650,
    combatLog: [],
    combatEvents: [],
};

export const dungeonCrawlerReducer = (
    state: DungeonCrawlerState,
    action: Actions,
): DungeonCrawlerState => {
    switch (action.type) {
        case 'PLAYER_USES_ABILITY': {
            const caster = action.caster;

            const isTargetInMonsterFormation = state.monsterFormation.combatants.find(
                (combatant) => combatant.id === action.target.id,
            );

            // Apply DoTs.
            const pointModifierEvents = applyPointModifierEffects(
                caster.id,
                state.playerInventory,
                caster.character,
            );

            const effectEvents = applyAbilityEffects(
                caster,
                action.ability,
                action.target,
                isTargetInMonsterFormation ? state.monsterFormation : state.playerFormation,
                state.playerInventory,
            );

            const decreaseEvent: CombatEvent = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_MODIFIERS,
                isProcessed: false,
                targetCombatantIDs: [caster.id],
            };

            const decreaseTurnTimers: CombatEvent = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_TURNS_UNTIL_ACTION,
                isProcessed: false,
            };

            return {
                ...state,
                phase: GamePhase.PLAYER_EXECUTES,
                playerFormation: updateFormation(state.playerFormation, { [caster.id]: caster }),
                combatEvents: [
                    ...state.combatEvents,
                    ...pointModifierEvents,
                    ...effectEvents,
                    decreaseEvent,
                    decreaseTurnTimers,
                ],
            };
        }
        case 'ENEMY_USES_ABILITY': {
            const actingMonster = state.monsterFormation.combatants
                .filter((combatant) => combatant instanceof MonsterCombatant)
                .find(
                    (monsterCombatant) =>
                        monsterCombatant.character.currentHP > 0 &&
                        monsterCombatant.turnsUntilAction <= 0,
                );

            if (!actingMonster) {
                return { ...state, phase: GamePhase.PLAYER_TURN };
            }

            const targetCombatant = selectTargetForMonster(state.playerFormation);
            const isTargetInPlayerFormation = state.playerFormation.combatants.find(
                (combatant) => combatant.id === targetCombatant.id,
            );

            const chosenAbility = pickMonsterAbility(
                actingMonster.character.currentMP,
                actingMonster.character.abilities,
            );

            const combatEvents: CombatEvent[] = [];

            // Apply DoTs
            const pointModifierEvents = applyPointModifierEffects(
                actingMonster.id,
                state.playerInventory,
                actingMonster.character,
            );
            combatEvents.push(...pointModifierEvents);

            const effectEvents = applyAbilityEffects(
                actingMonster,
                chosenAbility,
                targetCombatant,
                isTargetInPlayerFormation ? state.playerFormation : state.monsterFormation,
                state.playerInventory,
            );
            combatEvents.push(...effectEvents);

            // Decrease modifier durations
            const decreaseEvent: CombatEvent = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_MODIFIERS,
                isProcessed: false,
                targetCombatantIDs: [actingMonster.id],
            };
            combatEvents.push(decreaseEvent);

            if (actingMonster.turnsUntilAction <= 0) {
                combatEvents.push({
                    id: crypto.randomUUID(),
                    type: CombatEventType.RESET_TURN_TIMER,
                    isProcessed: false,
                    targetCombatantIDs: [actingMonster.id],
                });
            }

            return {
                ...state,
                phase: GamePhase.ENEMY_EXECUTES,
                monsterFormation: updateFormation(state.monsterFormation, {
                    [actingMonster.id]: actingMonster,
                }),
                combatEvents: [...state.combatEvents, ...combatEvents],
            };
        }
        case 'PROCESS_NEXT_EVENT': {
            const currentEvent = state.combatEvents.find((event) => !event.isProcessed);
            const playerFormation = state.playerFormation;
            const monsterFormation = state.monsterFormation;

            if (!currentEvent) {
                return state;
            }

            const allCombatants = [...monsterFormation.combatants, ...playerFormation.combatants];
            const handler = combatEventHandlers[currentEvent.type] as (
                event: CombatEvent,
                combatants: Combatant[],
                purchasedEquippables: Equipment[],
            ) => { [combatantID: string]: Combatant };
            const updatedCombatants = handler(currentEvent, allCombatants, state.playerInventory);

            const updatedPlayerFormation = updateFormation(playerFormation, updatedCombatants);
            const updatedMonsterFormation = updateFormation(monsterFormation, updatedCombatants);

            const newLogs =
                currentEvent.type === CombatEventType.APPLY_DAMAGE
                    ? generateDamageLogs(currentEvent, updatedCombatants)
                    : [];
            const updatedCombatLog = [...state.combatLog, ...newLogs];

            // Mark the current event as processed.
            const updatedEvents = state.combatEvents.map((event) => {
                if (event.id !== currentEvent.id) {
                    return event;
                }

                return { ...event, isProcessed: true };
            });

            // If any events are not processed, remain in the EXECUTION phase.
            if (updatedEvents.some((event) => !event.isProcessed)) {
                return {
                    ...state,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: updatedMonsterFormation,
                    combatEvents: updatedEvents,
                    combatLog: updatedCombatLog,
                };
            }

            const areAllPlayerCharactersDefeated = updatedPlayerFormation.combatants.every(
                (combatant) => combatant.character.currentHP <= 0,
            );
            const canAnyMonstersAct = updatedMonsterFormation.combatants
                .filter((combatant) => combatant instanceof MonsterCombatant)
                .some(
                    (monster) => monster.turnsUntilAction <= 0 && monster.character.currentHP > 0,
                );
            const isMonsterFormationDefeated = isFormationDefeated(updatedMonsterFormation);

            if (areAllPlayerCharactersDefeated) {
                return {
                    ...state,
                    phase: GamePhase.GAME_OVER,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: updatedMonsterFormation,
                    combatEvents: [],
                    combatLog: [],
                };
            }

            if (isMonsterFormationDefeated) {
                const newRoomsClearedCount = state.roomsClearedCount + 1;
                const shouldVisitShop = shouldPlayerVisitShop(newRoomsClearedCount);

                const monsterFormationValue = calculateValueOfCharacters(
                    updatedMonsterFormation.combatants.map((combatant) => combatant.character),
                );
                const newPlayerWealth = state.playerWealth + monsterFormationValue;

                return {
                    ...state,
                    phase: shouldVisitShop ? GamePhase.SHOPPING : GamePhase.PLAYER_TURN,
                    roomsClearedCount: newRoomsClearedCount,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: pickNewMonsterFormation(monsterFormations),
                    combatEvents: [],
                    combatLog: [],
                    playerWealth: newPlayerWealth,
                };
            }

            if (canAnyMonstersAct) {
                return {
                    ...state,
                    phase: GamePhase.ENEMY_TURN,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: updatedMonsterFormation,
                    combatEvents: updatedEvents,
                    combatLog: updatedCombatLog,
                };
            }

            return {
                ...state,
                phase: GamePhase.PLAYER_TURN,
                playerFormation: updatedPlayerFormation,
                monsterFormation: updatedMonsterFormation,
                combatEvents: updatedEvents,
                combatLog: updatedCombatLog,
            };
        }
        case 'LEAVE_SHOP': {
            const healedCombatants = state.playerFormation.combatants.map((combatant) => {
                const characterEquippables = state.playerInventory.filter(
                    (equippable) => equippable.characterID === combatant.character.id,
                );

                const healAmount = Math.round(
                    getCharacterStat(
                        combatant.character,
                        characterEquippables,
                        BaseStatNames.healthPoints,
                    ) / 2,
                );
                const newCharacter = changePoints(
                    combatant.character,
                    characterEquippables,
                    healAmount,
                    DamageType.HEALING,
                );

                return combatant.cloneWith({ character: newCharacter });
            });

            return {
                ...state,
                phase: GamePhase.PLAYER_TURN,
                playerFormation: { ...state.playerFormation, combatants: healedCombatants },
            };
        }
        case 'PURCHASE_ITEM': {
            const chosenItem = exampleEquippables.find((item) => item.id === action.itemID);
            const playerWealth = state.playerWealth;

            if (!chosenItem || playerWealth < chosenItem.cost) {
                return state;
            }

            const newWealth = playerWealth - chosenItem.cost;

            const newInventory = [...state.playerInventory, { ...chosenItem }];
            newInventory.sort((firstItem, secondItem) =>
                firstItem.name.localeCompare(secondItem.name),
            );

            return { ...state, playerInventory: newInventory, playerWealth: newWealth };
        }
        case 'PLAYER_TOGGLES_EQUIPMENT': {
            const newEquippableID = action.newEquippableID;
            const previousEquippableID = action.previousEquippableID;
            const targetCombatant = state.playerFormation.combatants.find(
                (combatant) => combatant.character.id === action.characterID,
            );

            if (!targetCombatant) {
                return state;
            }

            if (!previousEquippableID && !newEquippableID) {
                return state;
            }

            if (!newEquippableID) {
                const equippables = state.playerInventory.map((equippable) => {
                    const equippableCopy = { ...equippable };

                    if (equippableCopy.id === previousEquippableID) {
                        equippableCopy.characterID = null;
                    }

                    return equippableCopy;
                });

                return { ...state, playerInventory: equippables };
            }

            if (
                !canCharacterEquipItem(
                    state.playerInventory,
                    newEquippableID,
                    targetCombatant.character.id,
                    previousEquippableID,
                )
            ) {
                return state;
            }

            const equippables = state.playerInventory.map((equippable) => {
                const equippableCopy = { ...equippable };

                if (equippableCopy.id === previousEquippableID) {
                    equippableCopy.characterID = null;
                }

                if (equippableCopy.id === newEquippableID) {
                    equippableCopy.characterID = action.characterID;
                }

                return equippableCopy;
            });

            return { ...state, playerInventory: equippables };
        }
        default:
            return state;
    }
};

const updateFormation = (
    formation: Formation,
    combatantDictionary: Record<string, Combatant>,
): Formation => {
    return {
        ...formation,
        combatants: formation.combatants.map((combatant) => {
            return combatantDictionary[combatant.id] ?? combatant;
        }),
        gridDimensions: structuredClone(formation.gridDimensions),
    };
};
