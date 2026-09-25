import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { examplePlayerFormation } from './constants';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { buildNewMonsterFormation } from './monster/buildNewMonsterFormation';
import { exampleMonsters } from './monsters';
import {
    Ability,
    Character,
    Combatant,
    CombatEvents,
    CombatEventType,
    Formation,
    LogMessage,
    MonsterCombatant,
} from './types';
import { selectTargetForMonster } from './monster/selectTargetForMonster';
import {
    decreaseTurnsForMonsterCombatantList,
    resetTurnsUntilAction,
} from './monster/turnsUntilAction';
import { changeHealthPoints } from './character/changePoints';
import { decreaseModifierDuration } from './character/decreaseModifierDuration';

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
    combatEvents: CombatEvents[];
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

            const decreaseEvent: CombatEvents = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_MODIFIERS,
                isProcessed: false,
                combatantID: caster.id,
            };

            const decreaseTurnTimers: CombatEvents = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_TURNS_UNTIL_ACTION,
                isProcessed: false,
            };

            return {
                ...state,
                phase: GamePhase.PLAYER_EXECUTES,
                combatEvents: [
                    ...pointModifierEvents,
                    ...effectEvents,
                    decreaseEvent,
                    decreaseTurnTimers,
                ],
            };
        }
        case 'ENEMY_USES_ABILITY': {
            const monsterCombatants = state.monsterFormation.combatants
                .filter((combatant) => combatant instanceof MonsterCombatant)
                .filter((monsterCombatant) => monsterCombatant.character.currentHP > 0);
            const actingMonster = monsterCombatants.find(
                (combatant) => combatant.turnsUntilAction <= 0,
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

            // Apply DoTs
            const pointModifierEvents = applyPointModifierEffects(
                actingMonster.id,
                actingMonster.character,
            );

            const updatedActingMonster = actingMonster.cloneWith({
                turnsUntilAction: resetTurnsUntilAction(),
            });
            const effectEvents = applyAbilityEffects(
                updatedActingMonster,
                chosenAbility,
                targetCombatant,
                isTargetInPlayerFormation ? state.playerFormation : state.monsterFormation,
            );

            // Decrease modifier durations
            const decreaseEvent: CombatEvents = {
                id: crypto.randomUUID(),
                type: CombatEventType.DECREASE_MODIFIERS,
                isProcessed: false,
                combatantID: actingMonster.id,
            };

            return {
                ...state,
                phase: GamePhase.ENEMY_EXECUTES,
                combatEvents: [...pointModifierEvents, ...effectEvents, decreaseEvent],
            };
        }
        case 'PROCESS_NEXT_EVENT': {
            const currentEvent = state.combatEvents.find((event) => !event.isProcessed);

            if (!currentEvent) {
                return state;
            }

            const allCombatants: { [key: string]: Combatant } = [
                ...state.monsterFormation.combatants,
                ...state.playerFormation.combatants,
            ].reduce<{
                [key: string]: Combatant;
            }>((acc, combatant) => {
                acc[combatant.id] = combatant.clone();
                return acc;
            }, {});

            switch (currentEvent.type) {
                case CombatEventType.APPLY_DAMAGE: {
                    for (const target of currentEvent.targets) {
                        const targetToUpdate = allCombatants[target.targetCombatantID];
                        if (!targetToUpdate) {
                            continue;
                        }

                        const newCharacter: Character = changeHealthPoints(
                            targetToUpdate.character,
                            target.amount,
                            target.damageType,
                        );
                        targetToUpdate.character = newCharacter;
                    }
                    break;
                }
                case CombatEventType.APPLY_POINT_EFFECT: {
                    for (const targetID of currentEvent.targetCombatantIDs) {
                        const targetToUpdate = allCombatants[targetID];
                        if (!targetToUpdate) {
                            continue;
                        }

                        const newCharacter: Character = {
                            ...targetToUpdate.character,
                            pointModifiers: [
                                ...targetToUpdate.character.pointModifiers,
                                currentEvent.pointModifier,
                            ],
                        };
                        targetToUpdate.character = newCharacter;
                    }
                    break;
                }
                case CombatEventType.APPLY_STATUS_EFFECT: {
                    for (const targetID of currentEvent.targetCombatantIDs) {
                        const targetToUpdate = allCombatants[targetID];
                        if (!targetToUpdate) {
                            continue;
                        }

                        const newCharacter: Character = {
                            ...targetToUpdate.character,
                            modifiers: [
                                ...targetToUpdate.character.modifiers,
                                currentEvent.statModifier,
                            ],
                        };
                        targetToUpdate.character = newCharacter;
                    }
                    break;
                }
                case CombatEventType.DECREASE_MODIFIERS: {
                    const targetToUpdate = allCombatants[currentEvent.combatantID];
                    if (!targetToUpdate) {
                        break;
                    }

                    const { newCharacter } = decreaseModifierDuration(targetToUpdate.character);
                    targetToUpdate.character = newCharacter;
                    break;
                }
                case CombatEventType.DECREASE_TURNS_UNTIL_ACTION: {
                    const updatedCombatants = decreaseTurnsForMonsterCombatantList(
                        Object.values(allCombatants),
                    );

                    for (const updatedCombatant of updatedCombatants) {
                        allCombatants[updatedCombatant.id] = updatedCombatant;
                    }
                    break;
                }
                default:
                    break;
            }

            const updatedPlayerFormation = updateFormation(state.playerFormation, allCombatants);
            const updatedMonsterFormation = updateFormation(state.monsterFormation, allCombatants);

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
            const monsters = updatedMonsterFormation.combatants.filter(
                (combatant) => combatant instanceof MonsterCombatant,
            );

            if (areAllPlayerCharactersDefeated) {
                return {
                    ...state,
                    phase: GamePhase.GAME_OVER,
                    playerFormation: updatedPlayerFormation,
                    monsterFormation: updatedMonsterFormation,
                    combatEvents: updatedEvents,
                };
            }

            if (monsters.some((monster) => monster.turnsUntilAction <= 0)) {
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
    combatantDictionary: { [key: string]: Combatant },
): Formation => {
    const newFormation: Formation = {
        ...formation,
        combatants: formation.combatants.map((combatant) => combatant.clone()),
        gridDimensions: structuredClone(formation.gridDimensions),
    };

    const updatedCombatants = newFormation.combatants.map((combatant) => {
        const associatedCombatant = combatantDictionary[combatant.id];
        if (!associatedCombatant) {
            return combatant;
        }

        return associatedCombatant;
    });
    newFormation.combatants = updatedCombatants;

    return newFormation;
};
