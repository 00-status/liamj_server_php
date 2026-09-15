import { applyAbilityEffects, applyPointModifierEffects } from './character/applyAbilityEffects';
import { decreaseModifierDuration } from './character/decreaseModifierDuration';
import { examplePlayer } from './constants';
import { pickMonsterAbility } from './monster/pickMonsterAbility';
import { selectNewMonster } from './monster/selectNewMonster';
import { exampleMonsters } from './monsters';
import { Ability, Character, LogMessage } from './types';

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability }
    | { type: 'ENEMY_USES_ABILITY' }
    | { type: 'PLAYER_TOGGLES_EQUIPMENT'; equippableName: string };

export enum GamePhase {
    GAME_OVER = 'GAME_OVER',
    PLAYER_TURN = 'PLAYER_TURN',
    ENEMY_TURN = 'ENEMY_TURN',
}

type DungeonCrawlerState = {
    phase: GamePhase;
    roomsClearedCount: number;
    currentMonster: Character;
    currentPlayer: Character;
    combatLog: LogMessage[];
};

export const dungeonCrawlerInitialState: DungeonCrawlerState = {
    phase: GamePhase.PLAYER_TURN,
    roomsClearedCount: 0,
    currentMonster: selectNewMonster(exampleMonsters),
    currentPlayer: examplePlayer,
    combatLog: [],
};

export const dungeonCrawlerReducer = (
    state: DungeonCrawlerState,
    action: Actions,
): DungeonCrawlerState => {
    switch (action.type) {
        case 'PLAYER_USES_ABILITY': {
            const { target: playerWithPointModifiers, logs: pointModifierLogs } =
                applyPointModifierEffects(state.currentPlayer);

            const { newCharacter: playerWithDecreasedModifiers, logs: modifierLogs } =
                decreaseModifierDuration(playerWithPointModifiers);

            const {
                caster: newPlayer,
                opponent: newMonster,
                logs,
            } = applyAbilityEffects(
                playerWithDecreasedModifiers,
                state.currentMonster,
                action.ability,
            );

            if (newMonster.currentHP <= 0) {
                return {
                    ...state,
                    phase: GamePhase.PLAYER_TURN,
                    roomsClearedCount: state.roomsClearedCount + 1,
                    currentPlayer: newPlayer,
                    currentMonster: selectNewMonster(exampleMonsters),
                    combatLog: [],
                };
            }

            return {
                ...state,
                phase: GamePhase.ENEMY_TURN,
                currentPlayer: newPlayer,
                currentMonster: newMonster,
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
                phase: GamePhase.PLAYER_TURN,
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
