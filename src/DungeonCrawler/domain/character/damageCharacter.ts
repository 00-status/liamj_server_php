import { Character, DamageType } from '../types';

import { calculateDefence, calculateMagicDefence } from './calculateCharacterDefence';

const MAX_DAMAGE_REDUCTION = 0.8;

export const damageCharacter = (
    targetCharacter: Character,
    damageValue: number,
    damageType: DamageType,
): { updatedTarget: Character; healthChange: number } => {
    let actualDamageValue = 0;
    if (damageType === DamageType.magic) {
        const damageMultiplier = Math.max(
            calculateMagicDefence(targetCharacter),
            1.0 - MAX_DAMAGE_REDUCTION,
        );
        actualDamageValue = Math.round(Math.max(1, damageValue * damageMultiplier));
    } else {
        const damageMultiplier = Math.max(
            calculateDefence(targetCharacter),
            1.0 - MAX_DAMAGE_REDUCTION,
        );
        actualDamageValue = Math.round(Math.max(1, damageValue * damageMultiplier));
    }

    const newHealth = Math.max(0, targetCharacter.currentHP - actualDamageValue);

    const updatedTarget: Character = { ...targetCharacter, currentHP: newHealth };
    return { updatedTarget, healthChange: actualDamageValue };
};
