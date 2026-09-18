import { Combatant, MonsterCombatant } from '../types';
import { getRandomInt } from '../utiils';

export const decreaseTurnsForMonsterCombatantList = (combatants: Combatant[]): Combatant[] => {
    const monsterCombatants = combatants
        .filter((combatant) => combatant instanceof MonsterCombatant)
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
