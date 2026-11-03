import { BaseStatNames, type Ability } from '../types';

const PRIMARY_OFFENSIVE_STATS = new Set<BaseStatNames>([
    BaseStatNames.attack,
    BaseStatNames.magicAttack,
    BaseStatNames.mind,
]);

export const calculatePrimaryAbilityStat = (ability: Ability): BaseStatNames | null => {
    const allEffects = [...ability.pointEffects, ...ability.statusEffects];

    const relevantStats = new Set(
        allEffects
            .map((effect) => effect.scalingStat)
            .filter((stat) => PRIMARY_OFFENSIVE_STATS.has(stat)),
    );

    if (relevantStats.size === 1) {
        return relevantStats.values().next().value ?? null;
    }

    return null;
};
