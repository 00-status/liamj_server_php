import type { StatusEffect } from '../types';

const MAXIMUM_STAT_REDUCTION = 0.8;
const SCALING_FACTOR = 100;

export const calculateStatEffectDamage = (
    statusEffect: StatusEffect,
    casterScalingStat: number,
): number => {
    const scalingStatProduct = casterScalingStat * statusEffect.power;
    const statModiferValue =
        MAXIMUM_STAT_REDUCTION * (scalingStatProduct / (scalingStatProduct + SCALING_FACTOR));

    if (statusEffect.isBuff) {
        return statModiferValue + 1;
    }

    return 1.0 - statModiferValue;
};
