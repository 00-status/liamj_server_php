import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { examplePlayerFormation } from './constants';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { buildNewMonsterFormation } from './monster/buildNewMonsterFormation';
import { exampleMonsters } from './monsters';
import {
    Ability,
    Character,
    Combatant,
    CombatEvent,
    Formation,
    LogMessage,
    MonsterCombatant,
} from './types';
import { selectTargetForMonster } from './monster/selectTargetForMonster';
import { resetTurnsUntilAction } from './monster/turnsUntilAction';
import { changeHealthPoints } from './character/changePoints';

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

            // Decrease modifier durations
            const decreaseEvent: CombatEvent = {
                type: 'DECREASE_MODIFIERS',
                isProcessed: false,
                combatantID: caster.id,
            };

            return {
                ...state,
                phase: GamePhase.PLAYER_EXECUTES,
                combatEvents: [...pointModifierEvents, ...effectEvents, decreaseEvent],
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
            const decreaseEvent: CombatEvent = {
                type: 'DECREASE_MODIFIERS',
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

            if (currentEvent.type === 'APPLY_DAMAGE') {
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
            }

            // TODO:
            //      Add other event types
            //      Update formations with updated combatants.
            //      Update state with updated formations.

            return state;
        }
        case 'FINISH_EXECUTION': {
            const areAllPlayerCharactersDefeated = state.playerFormation.combatants.every(
                (combatant) => combatant.character.currentHP <= 0,
            );
            const monsters = state.monsterFormation.combatants.filter(
                (combatant) => combatant instanceof MonsterCombatant,
            );

            if (areAllPlayerCharactersDefeated) {
                return { ...state, phase: GamePhase.GAME_OVER };
            }

            if (monsters.some((monster) => monster.turnsUntilAction <= 0)) {
                return { ...state, phase: GamePhase.ENEMY_TURN };
            }

            return { ...state, phase: GamePhase.PLAYER_TURN };
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
