import { Combatant, MonsterCombatant } from '../types';
import { getRandomInt } from '../utiils';

/**
 * Decrements the turn timers for all active monsters. NOT guaranteed to return the entire list of Combatants.
 */
export const decreaseTurnsForMonsterCombatantList = (combatants: Combatant[]): Combatant[] => {
    const monsterCombatants = combatants
        .filter((combatant) => combatant instanceof MonsterCombatant)
        .filter((combatant) => combatant.character.currentHP > 0)
        .map((monsterCombatant) => {
            return monsterCombatant.cloneWith({
                turnsUntilAction: Math.max(0, monsterCombatant.turnsUntilAction - 1),
            });
        });

    return monsterCombatants;
};

export const resetTurnsUntilAction = (): number => {
    return getRandomInt(1, 4);
};
