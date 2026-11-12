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
        expect(budget).toBe(150);
    });

    it('returns the budget for negative floors by clamping to 0', () => {
        const budget = getEncounterBudget(-2);
        expect(budget).toBe(150);
    });

    it('returns the configured budget for intermediate floors', () => {
        expect(getEncounterBudget(1)).toBe(252);
        expect(getEncounterBudget(4)).toBe(1008);
        expect(getEncounterBudget(7)).toBe(2520);
    });

    it('extrapolates for floors exceeding the configured list', () => {
        const floor7Budget = 2520;
        const step = 1008;

        expect(getEncounterBudget(8)).toBe(floor7Budget + step);
        expect(getEncounterBudget(10)).toBe(floor7Budget + 3 * step);
    });
});

describe('buildMonsterFormation', () => {
    const testMonsters: MonsterCharacter[] = [
        createTestMonster('m-50', 'Small Goblin', 50),
        createTestMonster('m-75', 'Goblin Soldier', 75),
        createTestMonster('m-150', 'Goblin Chief', 150),
        createTestMonster('m-250', 'Ogre', 250),
        createTestMonster('m-500', 'Dragon Hatchling', 500),
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
        // Floor 0: budget = 150.
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
        // Floor 1: budget = 252.
        // If splitDuo is selected (weight 0.5 each):
        // targetThreat = 252 * 0.5 = 126.
        // Tolerance: [126 * 0.9, 126 * 1.1] = [113.4, 138.6].
        // If we provide a monster with threat 130 and another with threat 100:
        const duoMonsters: MonsterCharacter[] = [
            createTestMonster('m-100', 'Weakling', 100),
            createTestMonster('m-130', 'Match', 130),
            createTestMonster('m-200', 'Strong', 200),
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
        // Budget = 150. Solo template: targetThreat = 150.
        // Pool has monsters with threats 50 and 300.
        // |50 - 150| = 100, |300 - 150| = 150.
        // Closest is 50.
        const pool: MonsterCharacter[] = [
            createTestMonster('m-50', 'Far Lower', 50),
            createTestMonster('m-300', 'Far Higher', 300),
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
        // Floor 0 budget = 150.
        // Slot 1 (apex): targetThreat = 150 * 0.5 = 75.
        // Slot 2 (base left): targetThreat = 150 * 0.25 = 37.5.
        // Slot 3 (base right): targetThreat = 150 * 0.25 = 37.5.
        const pool: MonsterCharacter[] = [
            createTestMonster('m-leader', 'Boss Mini', 75),
            createTestMonster('m-minion', 'Minion', 38),
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
