import { Combatant, Formation } from '../types';

export const selectTargetForMonster = (playerFormation: Formation): Combatant => {
    let lowestHealthCombatant: Combatant | null = null;
    playerFormation.combatants.forEach((combatant) => {
        const isCombatantDefeated = combatant.character.currentHP <= 0;

        if (isCombatantDefeated) {
            return;
        }

        if (!lowestHealthCombatant) {
            lowestHealthCombatant = combatant;
        }

        if (combatant.character.currentHP < lowestHealthCombatant.character.currentHP) {
            lowestHealthCombatant = combatant;
        }
    });

    if (!lowestHealthCombatant) {
        throw new Error('Cannot find a Combatant!');
    }

    return lowestHealthCombatant;
};
