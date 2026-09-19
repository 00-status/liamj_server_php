import { Formation } from '../types';

export const isFormationDefeated = (formation: Formation): boolean => {
    const livingCombatants = formation.combatants.filter(
        (combatant) => combatant.character.currentHP > 0,
    );

    return livingCombatants.length === 0;
};
