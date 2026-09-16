import { Combatant, Formation, TargetScope } from '../types';

export const getValidTargets = (
    caster: Combatant,
    target: Combatant,
    formationOfTarget: Formation,
    targetScope: TargetScope,
): Combatant[] => {
    switch (targetScope) {
        case TargetScope.self:
            return [{ ...caster }];
        case TargetScope.target:
            return [{ ...target }];
        case TargetScope.all_opponents:
            return formationOfTarget.combatants.map((combatant) => ({ ...combatant }));
        case TargetScope.adjacent:
            return getAdjacentCombatants(target, formationOfTarget.combatants);
        case TargetScope.surrounding:
            return getAdjacentCombatants(target, formationOfTarget.combatants, true, false);
        case TargetScope.target_and_adjacent:
            return getAdjacentCombatants(target, formationOfTarget.combatants, false, true);
        case TargetScope.target_and_surrounding:
            return getAdjacentCombatants(target, formationOfTarget.combatants, true, true);
        default:
            return [];
    }
};

const getAdjacentCombatants = (
    target: Combatant,
    allCombatants: Combatant[],
    includeDiagonals = false,
    includeTarget = true,
): Combatant[] => {
    return allCombatants.filter((combatant) => {
        if (combatant.id === target.id && !includeTarget) {
            return false;
        }

        const rowDiff = Math.abs(combatant.position.x - target.position.x);
        const colDiff = Math.abs(combatant.position.y - target.position.y);

        if (includeDiagonals) {
            return rowDiff <= 1 && colDiff <= 1; // Chebyshev distance
        }
        return rowDiff + colDiff <= 1; // Manhattan distance (Up/Down/Left/Right)
    });
};
