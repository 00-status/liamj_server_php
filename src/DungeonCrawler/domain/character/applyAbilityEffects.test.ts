import {
    Ability,
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    Character,
    CharacterTier,
    Combatant,
    CombatEventType,
    DamageScaleMethod,
    DamageType,
    Equipment,
    EquipmentSlot,
    Formation,
    FormationTeam,
    TargetScope,
} from '../types';

import { applyAbilityEffects } from './applyAbilityEffects';

describe('applyAbilityEffects', () => {
    const buildCombatant = (characterID: string, combatantID: string, defence: number): Combatant => {
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
                magicAttack: 10,
                defence,
                magicDefence: 0,
            },
            modifiers: [],
            pointModifiers: [],
            abilities: [],
        };

        return new Combatant(combatantID, character, { x: 1, y: 1 });
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
});
