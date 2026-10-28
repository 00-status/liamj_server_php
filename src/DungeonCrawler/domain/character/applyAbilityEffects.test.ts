import { Combatant } from '../Combatant';
import type { Formation} from '../formation/types';
import { FormationTeam } from '../formation/types';
import type {
    Ability,
    Character,
    Equipment} from '../types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    CharacterTier,
    CombatEventType,
    DamageScaleMethod,
    DamageType,
    EquipmentSlot,
    TargetScope,
} from '../types';

import { applyAbilityEffects } from './applyAbilityEffects';

describe('applyAbilityEffects', () => {
    const buildCombatant = (
        characterID: string,
        combatantID: string,
        defence: number,
        critChance = 0,
        position = { x: 1, y: 1 },
    ): Combatant => {
        const character: Character = {
            id: characterID,
            name: 'Defender',
            tier: CharacterTier.ONE,
            currentHP: 100,
            currentMP: 10,
            stats: {
                healthPoints: 100,
                magicPoints: 10,
                attack: 50,
                magicAttack: 50,
                defence,
                magicDefence: 0,
                critChance,
            },
            modifiers: [],
            pointModifiers: [],
            abilities: [],
        };

        return new Combatant(combatantID, character, position);
    };

    const physicalAttackAbility: Ability = {
        name: 'Strike',
        cost: 0,
        type: AbilityType.default,
        abilityTarget: AbilityTarget.OPPONENT_FORMATION,
        statusEffects: [],
        pointEffects: [
            {
                id: 'eff-1',
                name: 'Physical Strike',
                power: 1,
                damageType: DamageType.PHYSICAL,
                duration: 0,
                target: TargetScope.target,
            },
        ],
    };

    it('uses target character equipment to mitigate damage', () => {
        const targetCharacterID = 'char-target';
        const targetCombatantID = 'combatant-target';
        const targetCombatant = buildCombatant(targetCharacterID, targetCombatantID, 0);

        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0);

        const defenderArmor: Equipment = {
            id: 'armor-1',
            characterID: targetCharacterID,
            name: 'Plate Armor',
            cost: 500,
            slot: EquipmentSlot.armour,
            modifiers: [
                {
                    id: 'mod-1',
                    stat: BaseStatNames.defence,
                    value: 100,
                    type: DamageScaleMethod.FLAT,
                },
            ],
        };

        const targetFormation: Formation = {
            id: 'formation-target',
            team: FormationTeam.PLAYER,
            combatants: [targetCombatant],
            gridDimensions: { x: 1, y: 1 },
        };

        // 1. Without armor, defence is 0. Base attack 50 -> 50 damage.
        const eventsWithoutArmor = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damageEventWithoutArmor = eventsWithoutArmor.find(
            (e) => e.type === CombatEventType.APPLY_DAMAGE,
        );
        expect(damageEventWithoutArmor).toBeDefined();
        expect(damageEventWithoutArmor?.damageTargets[0].amount).toBe(50);

        // 2. With armor providing +100 defence, scaling factor 100 / (100 + 100) = 0.5 -> 25 damage.
        const eventsWithArmor = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [defenderArmor],
        );
        const damageEventWithArmor = eventsWithArmor.find(
            (e) => e.type === CombatEventType.APPLY_DAMAGE,
        );
        expect(damageEventWithArmor).toBeDefined();
        expect(damageEventWithArmor?.damageTargets[0].amount).toBe(25);
    });

    it('guarantees a critical hit on the 4th attack when crit chance is 25% (1 in 4)', () => {
        const targetCombatant = buildCombatant('char-target', 'combatant-target', 0);
        // Attacker with 25% crit chance -> 1-in-4 marble bag: [true, false, false, false]
        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0, 25);
        const targetFormation: Formation = {
            id: 'formation-target',
            team: FormationTeam.MONSTER,
            combatants: [targetCombatant],
            gridDimensions: { x: 1, y: 1 },
        };

        // Helper randomFn that always picks the last element (which are the 'false' marbles until only 'true' remains)
        const pickLastMarble = () => 0.99;
        const spy = jest.spyOn(Math, 'random').mockImplementation(pickLastMarble);

        // Attack 1: Miss (marble drawn: false)
        const events1 = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage1 = events1.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage1?.damageTargets[0].isCritical).toBe(false);
        expect(damage1?.damageTargets[0].amount).toBe(50);
        expect(attackerCombatant.critBag.length).toBe(3);

        // Attack 2: Miss (marble drawn: false)
        const events2 = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage2 = events2.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage2?.damageTargets[0].isCritical).toBe(false);
        expect(damage2?.damageTargets[0].amount).toBe(50);
        expect(attackerCombatant.critBag.length).toBe(2);

        // Attack 3: Miss (marble drawn: false)
        const events3 = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage3 = events3.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage3?.damageTargets[0].isCritical).toBe(false);
        expect(damage3?.damageTargets[0].amount).toBe(50);
        expect(attackerCombatant.critBag.length).toBe(1);

        // Attack 4: Only [true] remains! Guaranteed critical hit regardless of randomFn!
        const events4 = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage4 = events4.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage4?.damageTargets[0].isCritical).toBe(true);
        expect(damage4?.damageTargets[0].amount).toBe(100); // Double damage (50 * 2)

        // After scoring a crit, the bag is immediately reset back to 4 marbles
        expect(attackerCombatant.critBag.length).toBe(4);

        spy.mockRestore();
    });

    it('resets the marble bag immediately upon scoring a critical hit early', () => {
        const targetCombatant = buildCombatant('char-target', 'combatant-target', 0);
        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0, 25);
        const targetFormation: Formation = {
            id: 'formation-target',
            team: FormationTeam.MONSTER,
            combatants: [targetCombatant],
            gridDimensions: { x: 1, y: 1 },
        };

        // randomFn returning 0 picks index 0 (which is `true` - a crit!)
        const pickCritMarble = () => 0;
        const spy = jest.spyOn(Math, 'random').mockImplementation(pickCritMarble);

        const events = applyAbilityEffects(
            attackerCombatant,
            physicalAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage = events.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage?.damageTargets[0].isCritical).toBe(true);
        expect(damage?.damageTargets[0].amount).toBe(100);

        // Bag should immediately be reset to full (4 marbles)
        expect(attackerCombatant.critBag.length).toBe(4);

        spy.mockRestore();
    });

    it('does not crit for non-physical abilities even with 100% crit chance', () => {
        const targetCombatant = buildCombatant('char-target', 'combatant-target', 0);
        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0, 100);
        const targetFormation: Formation = {
            id: 'formation-target',
            team: FormationTeam.MONSTER,
            combatants: [targetCombatant],
            gridDimensions: { x: 1, y: 1 },
        };

        const magicAttackAbility: Ability = {
            name: 'Zap',
            cost: 0,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            statusEffects: [],
            pointEffects: [
                {
                    id: 'eff-magic',
                    name: 'Magic Zap',
                    power: 1,
                    damageType: DamageType.MAGIC,
                    duration: 0,
                    target: TargetScope.target,
                },
            ],
        };

        const events = applyAbilityEffects(
            attackerCombatant,
            magicAttackAbility,
            targetCombatant,
            targetFormation,
            [],
        );
        const damage = events.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damage?.damageTargets[0].isCritical).toBeFalsy();
        expect(damage?.damageTargets[0].amount).toBe(50); // Not doubled
    });

    it('calculates crit chance per target for multi-target physical attacks', () => {
        const targetCombatant1 = buildCombatant('char-t1', 'combatant-t1', 0, 0, { x: 1, y: 1 });
        const targetCombatant2 = buildCombatant('char-t2', 'combatant-t2', 0, 0, { x: 2, y: 1 });
        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0, 25);

        const targetFormation: Formation = {
            id: 'formation-targets',
            team: FormationTeam.MONSTER,
            combatants: [targetCombatant1, targetCombatant2],
            gridDimensions: { x: 2, y: 1 },
        };

        const aoePhysicalAbility: Ability = {
            name: 'Whirlwind',
            cost: 0,
            type: AbilityType.skill,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            statusEffects: [],
            pointEffects: [
                {
                    id: 'eff-aoe',
                    name: 'Whirlwind Slash',
                    power: 1,
                    damageType: DamageType.PHYSICAL,
                    duration: 0,
                    target: TargetScope.entire_formation,
                },
            ],
        };

        // First roll draws false (picks last marble), second roll draws true (picks first marble)
        let callCount = 0;
        const sequentialRandom = () => {
            callCount++;
            return callCount === 1 ? 0.99 : 0;
        };
        const spy = jest.spyOn(Math, 'random').mockImplementation(sequentialRandom);

        const events = applyAbilityEffects(
            attackerCombatant,
            aoePhysicalAbility,
            targetCombatant1,
            targetFormation,
            [],
        );
        const damageEvent = events.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
        expect(damageEvent).toBeDefined();
        expect(damageEvent?.damageTargets).toHaveLength(2);

        // Target 1 was normal hit
        const target1Damage = damageEvent?.damageTargets.find(
            (t) => t.targetCombatantID === 'combatant-t1',
        );
        expect(target1Damage?.isCritical).toBe(false);
        expect(target1Damage?.amount).toBe(50);

        // Target 2 was critical hit
        const target2Damage = damageEvent?.damageTargets.find(
            (t) => t.targetCombatantID === 'combatant-t2',
        );
        expect(target2Damage?.isCritical).toBe(true);
        expect(target2Damage?.amount).toBe(100);

        // Bag reset because target 2 scored a crit
        expect(attackerCombatant.critBag.length).toBe(4);

        spy.mockRestore();
    });

    it('never crits when crit chance is 0%', () => {
        const targetCombatant = buildCombatant('char-target', 'combatant-target', 0);
        const attackerCombatant = buildCombatant('char-attacker', 'combatant-attacker', 0, 0);
        const targetFormation: Formation = {
            id: 'formation-target',
            team: FormationTeam.MONSTER,
            combatants: [targetCombatant],
            gridDimensions: { x: 1, y: 1 },
        };

        for (let i = 0; i < 5; i++) {
            const events = applyAbilityEffects(
                attackerCombatant,
                physicalAttackAbility,
                targetCombatant,
                targetFormation,
                [],
            );
            const damage = events.find((e) => e.type === CombatEventType.APPLY_DAMAGE);
            expect(damage?.damageTargets[0].isCritical).toBe(false);
            expect(damage?.damageTargets[0].amount).toBe(50);
        }
    });
});
