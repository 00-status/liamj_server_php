import { Ability } from '../types';

export const pickMonsterAbility = (currentMP: number, abilities: Ability[]): Ability => {
    const sortedAbilities = abilities.toSorted((ability1, ability2) => {
        return ability1.cost > ability2.cost ? -1 : 1;
    });

    const chosenAbility = sortedAbilities.find((ability) => ability.cost <= currentMP);

    if (!chosenAbility) {
        throw new Error('No valid abilities for Monster!');
    }

    return chosenAbility;
};
