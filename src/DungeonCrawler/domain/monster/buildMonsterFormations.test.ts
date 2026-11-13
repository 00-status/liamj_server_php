import { MonsterCombatant } from '../Combatant';
import { attackAbility, roomTemplates } from '../constants';
import { FormationTeam } from '../formation/types';
import type { MonsterCharacter } from '../types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    CharacterTier,
    DamageType,
    TargetScope,
} from '../types';

import { buildMonsterFormation, getEncounterBudget } from './buildMonsterFormations';

const createTestMonster = (id: string, name: string, threatScore: number): MonsterCharacter => {
    return {
        id,
        name,
        threatScore,
        tier: CharacterTier.ONE,
        currentHP: 50,
        currentMP: 10,
        stats: {
            healthPoints: 50,
            magicPoints: 10,
            attack: 10,
            magicAttack: 10,
            defence: 10,
            magicDefence: 10,
            critChance: 0,
            mind: 10,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [
            attackAbility,
            {
                name: 'Spell',
                cost: 2,
                type: AbilityType.magic,
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: 'effect-1',
                        name: 'Spell Effect',
                        target: TargetScope.target,
                        scalingStat: BaseStatNames.magicAttack,
                        damageType: DamageType.MAGIC,
                        power: 1,
                        duration: 0,
                    },
                ],
                statusEffects: [],
            },
        ],
    };
};

describe('getEncounterBudget', () => {
    it('returns the budget for floor 0', () => {
        const budget = getEncounterBudget(0);
        expect(budget).toBe(50);
    });

    it('returns the budget for negative floors by clamping to 0', () => {
        const budget = getEncounterBudget(-2);
        expect(budget).toBe(50);
    });

    it('returns the configured budget for intermediate floors', () => {
        expect(getEncounterBudget(1)).toBe(110);
        expect(getEncounterBudget(4)).toBe(350);
        expect(getEncounterBudget(7)).toBe(680);
    });
});

describe('buildMonsterFormation', () => {
    const testMonsters: MonsterCharacter[] = [
        createTestMonster('m-50', 'Small Goblin', 10),
        createTestMonster('m-75', 'Goblin Soldier', 25),
        createTestMonster('m-150', 'Goblin Chief', 50),
        createTestMonster('m-250', 'Ogre', 75),
        createTestMonster('m-500', 'Dragon Hatchling', 150),
    ];

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('throws an error if potential monsters list is empty', () => {
        expect(() => buildMonsterFormation(0, [])).toThrow(
            'Cannot build monster formation from empty monster list!',
        );
    });

    it('creates a valid formation on floor 0 with solo template', () => {
        // Floor 0: budget = 50.
        // Solo template has 1 slot, weight = 1 => targetThreat = 150.
        // Find solo template index in eligibleTemplates (roomTemplates with floorCountRequirement <= 0).
        const eligibleTemplates = roomTemplates.filter(
            (template) => template.floorCountRequirement <= 0,
        );
        const soloIndex = eligibleTemplates.findIndex((template) => template.slots.length === 1);
        expect(soloIndex).toBeGreaterThanOrEqual(0);

        const spyRandom = jest.spyOn(Math, 'random');
        // First random call selects template: return soloIndex / eligibleTemplates.length
        // Next random call selects candidate from candidates: return 0
        spyRandom.mockReturnValueOnce(soloIndex / eligibleTemplates.length).mockReturnValue(0);

        const formation = buildMonsterFormation(0, testMonsters);

        expect(formation.team).toBe(FormationTeam.MONSTER);
        expect(formation.combatants.length).toBe(1);
        expect(formation.combatants[0]).toBeInstanceOf(MonsterCombatant);

        const combatant = formation.combatants[0] as MonsterCombatant;
        expect(combatant.character.name).toBe('Goblin Chief');
        expect(combatant.position).toEqual({ x: 2, y: 2 });
        expect(combatant.turnsUntilAction).toBeGreaterThanOrEqual(1);
        expect(combatant.turnsUntilAction).toBeLessThanOrEqual(4);
    });

    it('selects monsters within the 10% tolerance window', () => {
        // Floor 1: budget = 110.
        // If splitDuo is selected (weight 0.5 each):
        // targetThreat = 110 * 0.5 = 55.
        // Tolerance: [55 * 0.9, 55 * 1.1] = [49.5, 60.5].
        // If we provide a monster with threat 55 and another with threat 40:
        const duoMonsters: MonsterCharacter[] = [
            createTestMonster('m-100', 'Weakling', 48),
            createTestMonster('m-130', 'Match', 60),
            createTestMonster('m-200', 'Strong', 100),
        ];

        const eligibleTemplates = roomTemplates.filter(
            (template) => template.floorCountRequirement <= 1,
        );
        const splitDuoIndex = eligibleTemplates.findIndex(
            (template) => template.slots.length === 2,
        );

        const spyRandom = jest.spyOn(Math, 'random');
        // 1. Template selection
        // 2. First slot candidate selection
        // 3. Second slot candidate selection
        spyRandom.mockReturnValueOnce(splitDuoIndex / eligibleTemplates.length).mockReturnValue(0);

        const formation = buildMonsterFormation(1, duoMonsters);

        expect(formation.combatants.length).toBe(2);
        for (const combatant of formation.combatants) {
            expect(combatant.character.name).toBe('Match');
        }
    });

    it('falls back to the mathematically closest monster if none fall within tolerance', () => {
        // Budget = 50. Solo template: targetThreat = 50.
        // Pool has monsters with threats 10 and 100.
        // |10 - 50| = 40, |100 - 50| = 50.
        // Closest is 10.
        const pool: MonsterCharacter[] = [
            createTestMonster('m-50', 'Far Lower', 10),
            createTestMonster('m-300', 'Far Higher', 100),
        ];

        const eligibleTemplates = roomTemplates.filter(
            (template) => template.floorCountRequirement <= 0,
        );
        const soloIndex = eligibleTemplates.findIndex((template) => template.slots.length === 1);

        const spyRandom = jest.spyOn(Math, 'random');
        spyRandom.mockReturnValueOnce(soloIndex / eligibleTemplates.length).mockReturnValue(0);

        const formation = buildMonsterFormation(0, pool);

        expect(formation.combatants.length).toBe(1);
        expect(formation.combatants[0].character.name).toBe('Far Lower');
    });

    it('deep clones characters so combatants do not share mutated state or IDs', () => {
        const pool: MonsterCharacter[] = [createTestMonster('m-75', 'Squire', 75)];

        const eligibleTemplates = roomTemplates.filter(
            (template) => template.floorCountRequirement <= 0,
        );
        const splitDuoIndex = eligibleTemplates.findIndex(
            (template) => template.slots.length === 2,
        );

        const spyRandom = jest.spyOn(Math, 'random');
        spyRandom.mockReturnValueOnce(splitDuoIndex / eligibleTemplates.length).mockReturnValue(0);

        const formation = buildMonsterFormation(0, pool);

        expect(formation.combatants.length).toBe(2);

        const firstCombatant = formation.combatants[0];
        const secondCombatant = formation.combatants[1];

        // Unique Combatant IDs
        expect(firstCombatant.id).not.toBe(secondCombatant.id);
        // Unique Character IDs
        expect(firstCombatant.character.id).not.toBe(secondCombatant.character.id);
        expect(firstCombatant.character.id).not.toBe('m-75');
        // Independent objects
        expect(firstCombatant.character).not.toBe(secondCombatant.character);
    });

    it('respects weighted slots in asymmetrical templates (e.g., triforce)', () => {
        // Triforce has slots: { x: 2, y: 1 } with weight 0.5, and two with weight 0.25
        // Total weight = 1.0.
        // Floor 0 budget = 50.
        // Slot 1 (apex): targetThreat = 50 * 0.5 = 25.
        // Slot 2 (base left): targetThreat = 50 * 0.25 = 12.5.
        // Slot 3 (base right): targetThreat = 50 * 0.25 = 12.5.
        const pool: MonsterCharacter[] = [
            createTestMonster('m-leader', 'Boss Mini', 27),
            createTestMonster('m-minion', 'Minion', 12),
        ];

        const eligibleTemplates = roomTemplates.filter(
            (template) => template.floorCountRequirement <= 0,
        );
        const triforceIndex = eligibleTemplates.findIndex(
            (template) =>
                template.slots.length === 3 &&
                template.slots.some((slot) => slot.threatWeight === 0.5),
        );

        const spyRandom = jest.spyOn(Math, 'random');
        spyRandom.mockReturnValueOnce(triforceIndex / eligibleTemplates.length).mockReturnValue(0);

        const formation = buildMonsterFormation(0, pool);

        expect(formation.combatants.length).toBe(3);
        const apexCombatant = formation.combatants.find(
            (combatant) => combatant.position.x === 2 && combatant.position.y === 1,
        );
        expect(apexCombatant).toBeDefined();
        expect(apexCombatant?.character.name).toBe('Boss Mini');

        const baseCombatants = formation.combatants.filter(
            (combatant) => combatant.position.y === 2,
        );
        expect(baseCombatants.length).toBe(2);
        for (const baseCombatant of baseCombatants) {
            expect(baseCombatant.character.name).toBe('Minion');
        }
    });
});
