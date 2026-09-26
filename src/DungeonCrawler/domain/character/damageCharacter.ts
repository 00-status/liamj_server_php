import { Character, DamageType } from '../types';

import { calculateDefence, calculateMagicDefence } from './calculateCharacterDefence';

const MAX_DAMAGE_REDUCTION = 0.8;

export const damageCharacter = (
    targetCharacter: Character,
    damageValue: number,
    damageType: DamageType,
): number => {
    const actualDamageValue = calculateDamage(damageType, targetCharacter, damageValue);
    return actualDamageValue;
};

const calculateDamage = (
    damageType: DamageType,
    targetCharacter: Character,
    damageValue: number,
) => {
    switch (damageType) {
        case DamageType.magic: {
            const damageMultiplier = Math.max(
                calculateMagicDefence(targetCharacter),
                1.0 - MAX_DAMAGE_REDUCTION,
            );
            return Math.round(Math.max(1, damageValue * damageMultiplier));
        }
        case DamageType.physical:
        default: {
            const damageMultiplier = Math.max(
                calculateDefence(targetCharacter),
                1.0 - MAX_DAMAGE_REDUCTION,
            );
            return Math.round(Math.max(1, damageValue * damageMultiplier));
        }
    }
};
