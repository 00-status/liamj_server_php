import { Combatant, MonsterCombatant } from '../types';
import { getRandomInt } from '../utiils';

export const updateTurnsForMonsterCombatantList = (combatants: Combatant[]): Combatant[] => {
    const monsterCombatants = combatants
        .filter((combatant) => {
            return combatant instanceof MonsterCombatant;
        })
        .map((monsterCombatant) => {
            return updateTurnsForMonsterCombatant(monsterCombatant);
        });

    return monsterCombatants;
};

const updateTurnsForMonsterCombatant = (combatant: MonsterCombatant): MonsterCombatant => {
    return combatant.turnsUntilAction <= 0
        ? combatant.cloneWith({ turnsUntilAction: resetTurnsUntilAction() })
        : combatant;
};

export const resetTurnsUntilAction = (): number => {
    return getRandomInt(1, 4);
};
