import { AbilityTarget, Combatant, FormationTeam } from '../types';

export const isTargetValid = (
    abilityTarget: AbilityTarget,
    casterID: string,
    target: Combatant,
    targetTeam: FormationTeam,
): boolean => {
    const isTargetingOpponents = abilityTarget === AbilityTarget.OPPONENT_FORMATION;
    const isTargetingAllies = abilityTarget === AbilityTarget.ALLY_FORMATION;
    const isTargetingSelf = abilityTarget === AbilityTarget.SELF;

    if (target.character.currentHP <= 0) {
        return false;
    }

    if (abilityTarget === AbilityTarget.ALL) {
        return true;
    }

    if (targetTeam === FormationTeam.MONSTER && isTargetingOpponents) {
        return true;
    }

    if (targetTeam === FormationTeam.PLAYER && isTargetingAllies) {
        return true;
    }

    if (isTargetingSelf && casterID === target.id) {
        return true;
    }

    return false;
};
