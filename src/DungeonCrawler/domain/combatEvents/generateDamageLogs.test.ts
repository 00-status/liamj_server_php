import { Combatant } from '../Combatant';
import {
    ApplyDamageEvent,
    Character,
    CharacterTier,
    CombatEventType,
    DamageType,
} from '../types';

import { generateDamageLogs } from './generateDamageLogs';

describe('generateDamageLogs', () => {
    const buildTestCharacter = (id: string, name: string): Character => ({
        id,
        name,
        tier: CharacterTier.ONE,
        currentHP: 100,
        currentMP: 20,
        stats: {
            healthPoints: 100,
            magicPoints: 20,
            attack: 20,
            magicAttack: 10,
            defence: 10,
            magicDefence: 10,
            critChance: 0,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [],
    });

    const jimothy = new Combatant('c-1', buildTestCharacter('char-1', 'Jimothy'), {
        x: 0,
        y: 0,
    });
    const skeleton = new Combatant('c-2', buildTestCharacter('char-2', 'Skeleton'), {
        x: 1,
        y: 0,
    });
    const zombie = new Combatant('c-3', buildTestCharacter('char-3', 'Zombie'), {
        x: 2,
        y: 0,
    });
    const skeletonPriest = new Combatant(
        'c-4',
        buildTestCharacter('char-4', 'Skeleton Priest'),
        { x: 3, y: 0 },
    );

    const combatants = {
        [jimothy.id]: jimothy,
        [skeleton.id]: skeleton,
        [zombie.id]: zombie,
        [skeletonPriest.id]: skeletonPriest,
    };

    it('generates physical damage logs', () => {
        const event: ApplyDamageEvent = {
            id: 'e-1',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton',
            damageType: DamageType.PHYSICAL,
            damageTargets: [{ targetCombatantID: jimothy.id, amount: 10 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName dealt %damageValue %damageType to %targetName!',
            sourceName: 'Skeleton',
            targetName: 'Jimothy',
            damageValue: 10,
            damageType: DamageType.PHYSICAL,
        });
    });

    it('generates magical damage logs', () => {
        const event: ApplyDamageEvent = {
            id: 'e-2',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton',
            damageType: DamageType.MAGIC,
            damageTargets: [{ targetCombatantID: jimothy.id, amount: 10 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName dealt %damageValue %damageType to %targetName!',
            sourceName: 'Skeleton',
            targetName: 'Jimothy',
            damageValue: 10,
            damageType: DamageType.MAGIC,
        });
    });

    it('generates healing log for another character', () => {
        const event: ApplyDamageEvent = {
            id: 'e-3',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.HEALING,
            damageTargets: [{ targetCombatantID: zombie.id, amount: 10 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName healed %targetName for %damageValue Health Points!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 10,
            damageType: DamageType.HEALING,
        });
    });

    it('generates self-healing log with "themself"', () => {
        const event: ApplyDamageEvent = {
            id: 'e-4',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.HEALING,
            damageTargets: [{ targetCombatantID: skeletonPriest.id, amount: 10 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName healed %targetName for %damageValue Health Points!',
            sourceName: 'Skeleton Priest',
            targetName: 'themself',
            damageValue: 10,
            damageType: DamageType.HEALING,
        });
    });

    it('generates magic restore log when amount >= 3', () => {
        const event: ApplyDamageEvent = {
            id: 'e-5',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.MAGIC_RESTORE,
            damageTargets: [{ targetCombatantID: zombie.id, amount: 4 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName restored %damageValue Magic Points to %targetName!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 4,
            damageType: DamageType.MAGIC_RESTORE,
        });
    });

    it('excludes magic restore log when amount < 3', () => {
        const event: ApplyDamageEvent = {
            id: 'e-6',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.MAGIC_RESTORE,
            damageTargets: [{ targetCombatantID: zombie.id, amount: 2 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(0);
    });

    it('generates magic drain log when amount >= 3', () => {
        const event: ApplyDamageEvent = {
            id: 'e-7',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.MAGIC_DRAIN,
            damageTargets: [{ targetCombatantID: zombie.id, amount: 4 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(1);
        expect(logs[0]).toMatchObject({
            template: '%sourceName drained %damageValue Magic Points to %targetName!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 4,
            damageType: DamageType.MAGIC_DRAIN,
        });
    });

    it('excludes magic drain log when amount < 3', () => {
        const event: ApplyDamageEvent = {
            id: 'e-8',
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Skeleton Priest',
            damageType: DamageType.MAGIC_DRAIN,
            damageTargets: [{ targetCombatantID: zombie.id, amount: 2 }],
        };

        const logs = generateDamageLogs(event, combatants);
        expect(logs).toHaveLength(0);
    });
});
