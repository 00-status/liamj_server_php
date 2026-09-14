import { applyAbilityEffects } from './character/applyAbilityEffects';
import { attackAbility } from './constants';
import { exampleEquippables } from './equippables';
import { selectNewMonster } from './monster/selectNewMonster';
import { exampleMonsters } from './monsters';
import { Ability, AbilityType, Character, DamageType, LogMessage, TargetScope } from './types';

const examplePlayer: Character = {
    name: 'Jimothy the Jacked',
    currentHP: 100,
    currentMP: 6,
    stats: {
        healthPoints: 100,
        magicPoints: 6,
        attack: 20,
        magicAttack: 20,
        defence: 10,
        magicDefence: 10,
    },
    modifiers: [],
    equipables: exampleEquippables,
    abilities: [
        attackAbility,
        {
            name: 'YEET!',
            cost: 3,
            type: AbilityType.magic,
            statusEffects: [
                {
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.5,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Sweep the Leg!',
            cost: 2,
            type: AbilityType.magic,
            statusEffects: [
                {
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.2,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Get me a beer!',
            cost: 2,
            type: AbilityType.magic,
            statusEffects: [
                {
                    target: TargetScope.self,
                    damageType: DamageType.healing,
                    power: 0.2,
                    modifiers: [],
                },
            ],
        },
    ],
};

type Actions =
    | { type: 'PLAYER_USES_ABILITY'; ability: Ability }
    | { type: 'ENEMY_USES_ABILITY'; ability: Ability }
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
            const {
                caster: newPlayer,
                opponent: newMonster,
                logs,
            } = applyAbilityEffects(state.currentPlayer, state.currentMonster, action.ability);

            if (newMonster.currentHP <= 0) {
                return {
                    ...state,
                    phase: GamePhase.PLAYER_TURN,
                    roomsClearedCount: state.roomsClearedCount++,
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
                combatLog: [...state.combatLog, ...logs],
            };
        }
        case 'ENEMY_USES_ABILITY': {
            const {
                caster: newMonster,
                opponent: newPlayer,
                logs,
            } = applyAbilityEffects(state.currentMonster, state.currentPlayer, action.ability);

            return {
                ...state,
                phase: GamePhase.PLAYER_TURN,
                currentPlayer: newPlayer,
                currentMonster: newMonster,
                combatLog: [...state.combatLog, ...logs],
            };
        }
        case 'PLAYER_TOGGLES_EQUIPMENT': {
            const equippables = state.currentPlayer.equipables.map((item) =>
                item.name === action.equippableName ? { ...item, active: !item.active } : item,
            );
            const newPlayer = { ...state.currentPlayer, equippables };

            return { ...state, currentPlayer: newPlayer };
        }
        default:
            return state;
    }
};
