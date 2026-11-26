import type { Combatant } from '../Combatant';
import type { Formation } from '../formation/types';
import { TargetScope } from '../types';

/**
 * Gets all valid targets, given the targetScope. Returns a deep copy of each combatant.
 * @param caster
 * @param target
 * @param formationOfTarget
 * @param targetScope
 * @returns
 */
export const getValidTargets = (
    caster: Combatant,
    target: Combatant,
    formationOfTarget: Formation,
    targetScope: TargetScope,
): Combatant[] => {
    switch (targetScope) {
        case TargetScope.self:
            return [structuredClone(caster)];
        case TargetScope.target:
            return [structuredClone(target)];
        case TargetScope.entire_formation:
            return formationOfTarget.combatants.map((combatant) => structuredClone(combatant));
        case TargetScope.adjacent:
            return getAdjacentCombatants(target, formationOfTarget.combatants);
        case TargetScope.surrounding:
            return getAdjacentCombatants(target, formationOfTarget.combatants, true, false);
        case TargetScope.target_and_adjacent:
            return getAdjacentCombatants(target, formationOfTarget.combatants, false, true);
        case TargetScope.target_and_surrounding:
            return getAdjacentCombatants(target, formationOfTarget.combatants, true, true);
        case TargetScope.target_and_column:
            return getColumnCombatants(target, formationOfTarget.combatants, true);
        case TargetScope.column:
            return getColumnCombatants(target, formationOfTarget.combatants, false);
        case TargetScope.target_and_row:
            return getRowCombatants(target, formationOfTarget.combatants, true);
        case TargetScope.row:
            return getRowCombatants(target, formationOfTarget.combatants, false);
        case TargetScope.target_and_diagonal:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'both', true);
        case TargetScope.diagonal:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'both', false);
        case TargetScope.target_and_backslash:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'backslash', true);
        case TargetScope.backslash:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'backslash', false);
        case TargetScope.target_and_forwardslash:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'forwardslash', true);
        case TargetScope.forwardslash:
            return getDiagonalCombatants(target, formationOfTarget.combatants, 'forwardslash', false);
        case TargetScope.above_target:
        case TargetScope.above_row:
            return getAboveCombatants(target, formationOfTarget.combatants);
        default:
            return [];
    }
};

const getColumnCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
    includeTarget = true,
): Combatant[] => {
    return allCombatants
        .filter((combatant) => {
            if (combatant.id === target.id && !includeTarget) {
                return false;
            }
            return combatant.position.x === target.position.x;
        })
        .map((combatant) => structuredClone(combatant));
};

const getRowCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
    includeTarget = true,
): Combatant[] => {
    return allCombatants
        .filter((combatant) => {
            if (combatant.id === target.id && !includeTarget) {
                return false;
            }
            return combatant.position.y === target.position.y;
        })
        .map((combatant) => structuredClone(combatant));
};

const getDiagonalCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
    direction: 'both' | 'backslash' | 'forwardslash',
    includeTarget = true,
): Combatant[] => {
    return allCombatants
        .filter((combatant) => {
            if (combatant.id === target.id) {
                return includeTarget;
            }

            const xDifference = combatant.position.x - target.position.x;
            const yDifference = combatant.position.y - target.position.y;

            const isBackslash = xDifference === yDifference;
            const isForwardslash = xDifference === -yDifference;

            if (direction === 'backslash') {
                return isBackslash;
            }
            if (direction === 'forwardslash') {
                return isForwardslash;
            }
            return isBackslash || isForwardslash;
        })
        .map((combatant) => structuredClone(combatant));
};

const getAboveCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
): Combatant[] => {
    return allCombatants
        .filter((combatant) => {
            return combatant.position.y < target.position.y;
        })
        .map((combatant) => structuredClone(combatant));
};

const getAdjacentCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
    includeDiagonals = false,
    includeTarget = true,
): Combatant[] => {
    return allCombatants
        .filter((combatant) => {
            if (combatant.id === target.id && !includeTarget) {
                return false;
            }

            const rowDiff = Math.abs(combatant.position.x - target.position.x);
            const colDiff = Math.abs(combatant.position.y - target.position.y);

            if (includeDiagonals) {
                return rowDiff <= 1 && colDiff <= 1; // Chebyshev distance
            }
            return rowDiff + colDiff <= 1; // Manhattan distance (Up/Down/Left/Right)
        })
        .map((combatant) => structuredClone(combatant));
};
