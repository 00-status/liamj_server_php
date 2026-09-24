import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { decreaseModifierDuration } from './character/decreaseModifierDuration';
import { examplePlayerFormation } from './constants';
import { isFormationDefeated } from './formation/isFormationDefeated';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { buildNewMonsterFormation } from './monster/buildNewMonsterFormation';
import { exampleMonsters } from './monsters';
import { Ability, Combatant, CombatEvent, Formation, LogMessage, MonsterCombatant } from './types';
import { selectTargetForMonster } from './monster/selectTargetForMonster';
import {
    resetTurnsUntilAction,
    decreaseTurnsForMonsterCombatantList,
} from './monster/turnsUntilAction';

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability; caster: Combatant; target: Combatant }
    | { type: 'ENEMY_USES_ABILITY' }
    | { type: 'FINISH_EXECUTION' }
    | { type: 'PLAYER_TOGGLES_EQUIPMENT'; combatantID: string; equippableName: string };

export enum GamePhase {
    GAME_OVER = 'GAME_OVER',
    PLAYER_TURN = 'PLAYER_TURN',
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
            const isTargetInMonsterFormation = state.monsterFormation.combatants.find(
                (combatant) => combatant.id === action.target.id,
            );

            // Apply DoTs and decrease Modifier durations.
            const pointModifierEvents = applyPointModifierEffects(
                action.caster.id,
                action.caster.character,
            );

            const { newCharacter: playerWithDecreasedModifiers, logs: modifierLogs } =
                decreaseModifierDuration(playerWithPointModifiers);

            // Apply the ability's effects.
            const { updatedCombatants, logs } = applyAbilityEffects(
                action.caster.cloneWith({ character: playerWithDecreasedModifiers }),
                action.ability,
                action.target,
                isTargetInMonsterFormation ? state.monsterFormation : state.playerFormation,
            );

            const newMonsterFormation = updateFormation(state.monsterFormation, updatedCombatants);
            const newPlayerFormation = updateFormation(state.playerFormation, updatedCombatants);

            const isMonsterFormationDefeated = isFormationDefeated(newMonsterFormation);
            if (isMonsterFormationDefeated) {
                return {
                    ...state,
                    phase: GamePhase.PLAYER_TURN,
                    roomsClearedCount: state.roomsClearedCount + 1,
                    playerFormation: newPlayerFormation,
                    monsterFormation: buildNewMonsterFormation(exampleMonsters),
                    combatLog: [],
                };
            }

            // Decrease enemy turnsUntilAction
            const monsterFormationWithUpdatedTurns: Formation = {
                ...newMonsterFormation,
                combatants: decreaseTurnsForMonsterCombatantList(newMonsterFormation.combatants),
            };

            return {
                ...state,
                phase: GamePhase.ENEMY_TURN,
                playerFormation: newPlayerFormation,
                monsterFormation: monsterFormationWithUpdatedTurns,
                combatLog: [...state.combatLog, ...pointModifierLogs, ...modifierLogs, ...logs],
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

            const { target: actingMonsterWithPointModifiers, logs: pointModifierLogs } =
                applyPointModifierEffects(actingMonster.character);
            const { newCharacter: actingMonsterWithDecreasedModifiers, logs: modifierLogs } =
                decreaseModifierDuration(actingMonsterWithPointModifiers);

            const updatedActingMonster = actingMonster.cloneWith({
                character: actingMonsterWithDecreasedModifiers,
                turnsUntilAction: resetTurnsUntilAction(),
            });

            const { updatedCombatants, logs } = applyAbilityEffects(
                updatedActingMonster,
                chosenAbility,
                targetCombatant,
                isTargetInPlayerFormation ? state.playerFormation : state.monsterFormation,
            );

            const newMonsterFormation = updateFormation(state.monsterFormation, updatedCombatants);
            const newPlayerFormation = updateFormation(state.playerFormation, updatedCombatants);

            return {
                ...state,
                phase: GamePhase.ENEMY_EXECUTES,
                monsterFormation: newMonsterFormation,
                playerFormation: newPlayerFormation,
                combatLog: [...state.combatLog, ...pointModifierLogs, ...modifierLogs, ...logs],
            };
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
