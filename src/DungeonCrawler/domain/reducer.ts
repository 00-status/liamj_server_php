import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { examplePlayerFormation } from './constants';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { buildNewMonsterFormation } from './monster/buildNewMonsterFormation';
import { exampleMonsters } from './monsters';
import {
    Ability,
    Combatant,
    CombatEvent,
    CombatEventType,
    Formation,
    LogMessage,
    MonsterCombatant,
} from './types';
import { selectTargetForMonster } from './monster/selectTargetForMonster';
import { resetTurnsUntilAction } from './monster/turnsUntilAction';
import { isFormationDefeated } from './formation/isFormationDefeated';
import { combatEventHandlers } from './combatEvents/combatEventHandlers';

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability; caster: Combatant; target: Combatant }
    | { type: 'ENEMY_USES_ABILITY' }
    | { type: 'PROCESS_NEXT_EVENT' }
    | { type: 'FINISH_EXECUTION' }
    | { type: 'PLAYER_TOGGLES_EQUIPMENT'; combatantID: string; equippableName: string };

export enum GamePhase {
    GAME_OVER = 'GAME_OVER',
    PLAYER_TURN = 'PLAYER_TURN',
    PLAYER_EXECUTES = 'PLAYER_EXECUTES',
    ENEMY_TURN = 'ENEMY_TURN',
    ENEMY_EXECUTES = 'ENEMY_EXECUTES',
}

type DungeonCrawlerState = {
    phase: GamePhase;
    roomsClearedCount: number;
    monsterFormation: Formation;
    playerFormation: Formation;
    combatLog: LogMessage[];
    combatEvents: CombatEvent[];
};

export const dungeonCrawlerInitialState: DungeonCrawlerState = {
    phase: GamePhase.PLAYER_TURN,
    roomsClearedCount: 0,
    monsterFormation: buildNewMonsterFormation(exampleMonsters),
    playerFormation: examplePlayerFormation,
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
            const pointModifierEvents = applyPointModifierEffects(caster.id, caster.character);

            const effectEvents = applyAbilityEffects(
                caster,
                action.ability,
                action.target,
                isTargetInMonsterFormation ? state.monsterFormation : state.playerFormation,
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
                actingMonster.character,
            );
            combatEvents.push(...pointModifierEvents);

            const updatedActingMonster = actingMonster.cloneWith({
                turnsUntilAction: resetTurnsUntilAction(),
            });
            const effectEvents = applyAbilityEffects(
                updatedActingMonster,
                chosenAbility,
                targetCombatant,
                isTargetInPlayerFormation ? state.playerFormation : state.monsterFormation,
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
            ) => { [combatantID: string]: Combatant };
            const updatedCombatants = handler(currentEvent, allCombatants);

            const updatedPlayerFormation = updateFormation(playerFormation, updatedCombatants);
            const updatedMonsterFormation = updateFormation(monsterFormation, updatedCombatants);

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
                return {
                    ...state,
                    phase: GamePhase.PLAYER_TURN,
                    roomsClearedCount: state.roomsClearedCount + 1,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: buildNewMonsterFormation(exampleMonsters),
                    combatEvents: [],
                    combatLog: [],
                };
            }

            if (canAnyMonstersAct) {
                return {
                    ...state,
                    phase: GamePhase.ENEMY_TURN,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: updatedMonsterFormation,
                    combatEvents: updatedEvents,
                };
            }

            return {
                ...state,
                phase: GamePhase.PLAYER_TURN,
                playerFormation: updatedPlayerFormation,
                monsterFormation: updatedMonsterFormation,
                combatEvents: updatedEvents,
            };
        }
        case 'PLAYER_TOGGLES_EQUIPMENT': {
            const targetCombatant = state.playerFormation.combatants.find(
                (combatant) => combatant.id === action.combatantID,
            );

            if (!targetCombatant) {
                return state;
            }

            const equipables = targetCombatant.character.equipables.map((item) =>
                item.name === action.equippableName ? { ...item, active: !item.active } : item,
            );
            const combatants: Combatant[] = state.playerFormation.combatants.map((combatant) => {
                return combatant.id === targetCombatant.id
                    ? targetCombatant.cloneWith({
                          character: { ...targetCombatant.character, equipables },
                      })
                    : combatant;
            });

            return { ...state, playerFormation: { ...state.playerFormation, combatants } };
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
