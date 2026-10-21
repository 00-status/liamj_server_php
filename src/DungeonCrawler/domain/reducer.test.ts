import {
    dungeonCrawlerInitialState,
    dungeonCrawlerReducer,
    GamePhase,
} from './reducer';
import {
    ApplyDamageEvent,
    CombatEventType,
    DamageType,
} from './types';

describe('dungeonCrawlerReducer - combatLog', () => {
    it('appends combat logs when processing an APPLY_DAMAGE event', () => {
        const targetCombatant = dungeonCrawlerInitialState.playerFormation.combatants[0];
        const event: ApplyDamageEvent = {
            id: 'event-1',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton',
            damageType: DamageType.PHYSICAL,
            damageTargets: [
                {
                    targetCombatantID: targetCombatant.id,
                    amount: 10,
                },
            ],
        };

        const stateWithEvent = {
            ...dungeonCrawlerInitialState,
            phase: GamePhase.ENEMY_EXECUTES,
            combatEvents: [event],
            combatLog: [],
        };

        const newState = dungeonCrawlerReducer(stateWithEvent, {
            type: 'PROCESS_NEXT_EVENT',
        });

        expect(newState.combatLog).toHaveLength(1);
        expect(newState.combatLog[0]).toMatchObject({
            sourceName: 'Skeleton',
            targetName: targetCombatant.character.name,
            damageValue: 10,
            damageType: DamageType.PHYSICAL,
        });
    });

    it('clears the combat log when the monster formation is defeated (room cleared)', () => {
        // Monster formation with all monsters defeated (HP <= 0)
        const defeatedMonsterFormation = {
            ...dungeonCrawlerInitialState.monsterFormation,
            combatants: dungeonCrawlerInitialState.monsterFormation.combatants.map(
                (combatant) =>
                    combatant.cloneWith({
                        character: {
                            ...combatant.character,
                            currentHP: 0,
                        },
                    }),
            ),
        };

        const targetCombatant = dungeonCrawlerInitialState.playerFormation.combatants[0];
        const event: ApplyDamageEvent = {
            id: 'event-1',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Hero',
            damageType: DamageType.PHYSICAL,
            damageTargets: [
                {
                    targetCombatantID: targetCombatant.id,
                    amount: 5,
                },
            ],
        };

        const stateWithLogs = {
            ...dungeonCrawlerInitialState,
            monsterFormation: defeatedMonsterFormation,
            combatEvents: [event],
            combatLog: [
                {
                    id: 'old-log',
                    template: 'old log',
                    sourceName: 'Hero',
                    targetName: 'Monster',
                    damageValue: 5,
                    damageType: DamageType.PHYSICAL,
                },
            ],
        };

        const newState = dungeonCrawlerReducer(stateWithLogs, {
            type: 'PROCESS_NEXT_EVENT',
        });

        expect(newState.combatLog).toEqual([]);
    });
});
