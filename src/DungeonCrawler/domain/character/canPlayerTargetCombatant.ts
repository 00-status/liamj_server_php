import { AbilityTarget, FormationTeam } from '../types';

export const canPlayerTargetCombatant = (
    abilityTarget: AbilityTarget,
    casterID: string,
    targetID: string,
    targetTeam: FormationTeam,
): boolean => {
    const isTargetingOpponents = abilityTarget === AbilityTarget.OPPONENT_FORMATION;
    const isTargetingAllies = abilityTarget === AbilityTarget.ALLY_FORMATION;
    const isTargetingSelf = abilityTarget === AbilityTarget.SELF;

    if (abilityTarget === AbilityTarget.ALL) {
        return true;
    }

    if (targetTeam === FormationTeam.MONSTER && isTargetingOpponents) {
        return true;
    }

    if (targetTeam === FormationTeam.PLAYER && isTargetingAllies) {
        return true;
    }

    if (isTargetingSelf && casterID === targetID) {
        return true;
    }

    return false;
};
