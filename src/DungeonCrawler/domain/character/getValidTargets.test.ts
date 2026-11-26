import { MonsterCombatant } from '../Combatant';
import type { Formation } from '../formation/types';
import { FormationTeam } from '../formation/types';
import type { MonsterCharacter } from '../types';
import {
    BaseStatNames,
    CharacterRole,
    TargetScope,
} from '../types';

import { getValidTargets } from './getValidTargets';

describe('getValidTargets', () => {
    const createCombatant = (id: string, x: number, y: number): MonsterCombatant => {
        const character: MonsterCharacter = {
            id,
            name: `Monster-${id}`,
            role: CharacterRole.MINION,
            tags: [],
            threatScore: 10,
            currentHP: 100,
            currentMP: 50,
            stats: {
                [BaseStatNames.healthPoints]: 100,
                [BaseStatNames.magicPoints]: 50,
                [BaseStatNames.attack]: 10,
                [BaseStatNames.magicAttack]: 10,
                [BaseStatNames.defence]: 10,
                [BaseStatNames.magicDefence]: 10,
                [BaseStatNames.critChance]: 5,
                [BaseStatNames.mind]: 10,
            },
            modifiers: [],
            pointModifiers: [],
            abilities: [],
        };
        return new MonsterCombatant(id, character, { x, y }, 0, []);
    };

    // A 3x3 grid of combatants
    // (1,1) (2,1) (3,1)
    // (1,2) (2,2) (3,2)
    // (1,3) (2,3) (3,3)
    const combatants = [
        createCombatant('c11', 1, 1),
        createCombatant('c21', 2, 1),
        createCombatant('c31', 3, 1),
        createCombatant('c12', 1, 2),
        createCombatant('c22', 2, 2),
        createCombatant('c32', 3, 2),
        createCombatant('c13', 1, 3),
        createCombatant('c23', 2, 3),
        createCombatant('c33', 3, 3),
    ];

    const formation: Formation = {
        id: 'test-formation',
        team: FormationTeam.MONSTER,
        gridDimensions: { x: 3, y: 3 },
        combatants,
    };

    const caster = combatants[0]; // c11
    const target = combatants[4]; // c22 (center)

    it('returns caster for TargetScope.self', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.self);
        expect(targets).toHaveLength(1);
        expect(targets[0].id).toBe(caster.id);
    });

    it('returns only target for TargetScope.target', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target);
        expect(targets).toHaveLength(1);
        expect(targets[0].id).toBe(target.id);
    });

    it('returns all combatants for TargetScope.entire_formation', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.entire_formation);
        expect(targets).toHaveLength(9);
    });

    it('returns adjacent combatants excluding target for TargetScope.adjacent', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.adjacent);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c21', 'c12', 'c32', 'c23']));
        expect(targetIds).toHaveLength(4);
    });

    it('returns target and adjacent combatants for TargetScope.target_and_adjacent', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_adjacent);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c21', 'c12', 'c22', 'c32', 'c23']));
        expect(targetIds).toHaveLength(5);
    });

    it('returns surrounding combatants excluding target for TargetScope.surrounding', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.surrounding);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(
            expect.arrayContaining(['c11', 'c21', 'c31', 'c12', 'c32', 'c13', 'c23', 'c33']),
        );
        expect(targetIds).toHaveLength(8);
    });

    it('returns target and surrounding combatants for TargetScope.target_and_surrounding', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_surrounding);
        expect(targets).toHaveLength(9);
    });

    it('returns target and column combatants for TargetScope.target_and_column', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_column);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c21', 'c22', 'c23']));
        expect(targetIds).toHaveLength(3);
    });

    it('returns column combatants without target for TargetScope.column', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.column);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c21', 'c23']));
        expect(targetIds).toHaveLength(2);
    });

    it('returns target and row combatants for TargetScope.target_and_row', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_row);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c12', 'c22', 'c32']));
        expect(targetIds).toHaveLength(3);
    });

    it('returns row combatants without target for TargetScope.row', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.row);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c12', 'c32']));
        expect(targetIds).toHaveLength(2);
    });

    it('returns target and diagonal combatants for TargetScope.target_and_diagonal', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_diagonal);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c11', 'c33', 'c31', 'c13', 'c22']));
        expect(targetIds).toHaveLength(5);
    });

    it('returns diagonal combatants without target for TargetScope.diagonal', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.diagonal);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c11', 'c33', 'c31', 'c13']));
        expect(targetIds).toHaveLength(4);
    });

    it('returns target and backslash combatants for TargetScope.target_and_backslash', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_backslash);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c11', 'c22', 'c33']));
        expect(targetIds).toHaveLength(3);
    });

    it('returns backslash combatants without target for TargetScope.backslash', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.backslash);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c11', 'c33']));
        expect(targetIds).toHaveLength(2);
    });

    it('returns target and forwardslash combatants for TargetScope.target_and_forwardslash', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.target_and_forwardslash);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c31', 'c22', 'c13']));
        expect(targetIds).toHaveLength(3);
    });

    it('returns forwardslash combatants without target for TargetScope.forwardslash', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.forwardslash);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c31', 'c13']));
        expect(targetIds).toHaveLength(2);
    });

    it('returns combatants in the same column above the target for TargetScope.above_target', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.above_target);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(['c21']);
        expect(targetIds).toHaveLength(1);
    });

    it('returns all combatants in any column above the target row for TargetScope.above_row', () => {
        const targets = getValidTargets(caster, target, formation, TargetScope.above_row);
        const targetIds = targets.map((combatant) => combatant.id);
        expect(targetIds).toEqual(expect.arrayContaining(['c11', 'c21', 'c31']));
        expect(targetIds).toHaveLength(3);
    });
});
