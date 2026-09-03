import { Character, DamageType } from '../types';

import { calculateDefence, calculateMagicDefence } from './calculateCharacterDefence';

export const damageCharacter = (
    targetCharacter: Character,
    damageValue: number,
    damageType: DamageType,
): { newHealth: number; damageTaken: number } => {
    let actualDamageValue = 0;
    if (damageType === DamageType.magic) {
        actualDamageValue = Math.max(1, damageValue * calculateMagicDefence(targetCharacter));
    } else {
        actualDamageValue = Math.max(1, damageValue - calculateDefence(targetCharacter));
    }

    const newHealth = Math.max(0, targetCharacter.currentHP - actualDamageValue);

    return { newHealth, damageTaken: actualDamageValue };
};
