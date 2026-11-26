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
    if (targetScope === TargetScope.self) {
        return [structuredClone(caster)];
    }

    return formationOfTarget.combatants
        .filter((combatant) => matchesScope(combatant, target, targetScope))
        .map((combatant) => structuredClone(combatant));
};

const matchesScope = (
    combatant: Combatant,
    target: Combatant,
    targetScope: TargetScope,
): boolean => {
    const isTarget = combatant.id === target.id;
    const xDifference = combatant.position.x - target.position.x;
    const yDifference = combatant.position.y - target.position.y;
    const horizontalDistance = Math.abs(xDifference);
    const verticalDistance = Math.abs(yDifference);

    switch (targetScope) {
        case TargetScope.target:
            return isTarget;
        case TargetScope.entire_formation:
            return true;
        case TargetScope.adjacent:
            return !isTarget && horizontalDistance + verticalDistance <= 1;
        case TargetScope.target_and_adjacent:
            return horizontalDistance + verticalDistance <= 1;
        case TargetScope.surrounding:
            return !isTarget && horizontalDistance <= 1 && verticalDistance <= 1;
        case TargetScope.target_and_surrounding:
            return horizontalDistance <= 1 && verticalDistance <= 1;
        case TargetScope.column:
            return !isTarget && xDifference === 0;
        case TargetScope.target_and_column:
            return xDifference === 0;
        case TargetScope.row:
            return !isTarget && yDifference === 0;
        case TargetScope.target_and_row:
            return yDifference === 0;
        case TargetScope.diagonal:
            return !isTarget && horizontalDistance === verticalDistance;
        case TargetScope.target_and_diagonal:
            return horizontalDistance === verticalDistance;
        case TargetScope.backslash:
            return !isTarget && xDifference === yDifference;
        case TargetScope.target_and_backslash:
            return xDifference === yDifference;
        case TargetScope.forwardslash:
            return !isTarget && xDifference === -yDifference;
        case TargetScope.target_and_forwardslash:
            return xDifference === -yDifference;
        case TargetScope.above_target:
            return xDifference === 0 && yDifference < 0;
        case TargetScope.above_row:
            return yDifference < 0;
        default:
            return false;
    }
};
