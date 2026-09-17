import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { decreaseModifierDuration } from './character/decreaseModifierDuration';
import { examplePlayer } from './constants';
import { isFormationDefeated } from './formation/isFormationDefeated';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { buildNewMonsterFormation } from './monster/buildNewMonsterFormation';
import { exampleMonsters } from './monsters';
import { Ability, Character, Combatant, Formation, LogMessage } from './types';

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability; caster: Combatant; target: Combatant }
    | { type: 'ENEMY_USES_ABILITY' }
    | { type: 'PLAYER_TOGGLES_EQUIPMENT'; equippableName: string };

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
};

export const dungeonCrawlerInitialState: DungeonCrawlerState = {
    phase: GamePhase.PLAYER_TURN,
    roomsClearedCount: 0,
    monsterFormation: buildNewMonsterFormation(exampleMonsters),
    playerFormation: examplePlayer, // TODO: Create a player formation with two Combatants in it.
    combatLog: [],
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

            const { target: playerWithPointModifiers, logs: pointModifierLogs } =
                applyPointModifierEffects(action.caster.character);
            const { newCharacter: playerWithDecreasedModifiers, logs: modifierLogs } =
                decreaseModifierDuration(playerWithPointModifiers);

            const { updatedCombatants, logs } = applyAbilityEffects(
                action.caster.copyWith({ character: playerWithDecreasedModifiers }),
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

            return {
                ...state,
                phase: GamePhase.ENEMY_TURN,
                playerFormation: newPlayerFormation,
                monsterFormation: newMonsterFormation,
                combatLog: [...state.combatLog, ...pointModifierLogs, ...modifierLogs, ...logs],
            };
        }
        case 'ENEMY_USES_ABILITY': {
            const chosenAbility = pickMonsterAbility(
                state.currentMonster.currentMP,
                state.currentMonster.abilities,
            );

            const { target: monsterWithPointModifiers, logs: pointModifierLogs } =
                applyPointModifierEffects(state.currentMonster);

            const { newCharacter: monsterWithDecreasedModifiers, logs: modifierLogs } =
                decreaseModifierDuration(monsterWithPointModifiers);

            const {
                caster: newMonster,
                opponent: newPlayer,
                logs,
            } = applyAbilityEffects(
                monsterWithDecreasedModifiers,
                state.currentPlayer,
                chosenAbility,
            );

            return {
                ...state,
                phase: GamePhase.ENEMY_EXECUTES,
                currentPlayer: newPlayer,
                currentMonster: newMonster,
                combatLog: [...state.combatLog, ...pointModifierLogs, ...modifierLogs, ...logs],
            };
        }
        case 'PLAYER_TOGGLES_EQUIPMENT': {
            const equipables = state.currentPlayer.equipables.map((item) =>
                item.name === action.equippableName ? { ...item, active: !item.active } : item,
            );
            const newPlayer: Character = { ...state.currentPlayer, equipables };

            return { ...state, currentPlayer: newPlayer };
        }
        default:
            return state;
    }
};

const updateFormation = (
    formation: Formation,
    combatantDictionary: { [key: string]: Combatant },
): Formation => {
    const newFormation = structuredClone(formation);

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
