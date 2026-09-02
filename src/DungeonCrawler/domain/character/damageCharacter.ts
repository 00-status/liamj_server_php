import { Character, DamageType } from '../types';

export const damageCharacter = (
    targetCharacter: Character,
    damageValue: number,
    damageType: DamageType,
): { newHealth: number; damageTaken: number } => {
    let actualDamageValue = 0;
    if (damageType === DamageType.magic) {
        actualDamageValue = Math.min(1, damageValue - targetCharacter.stats.magicDefence);
    } else {
        actualDamageValue = Math.min(1, damageValue - targetCharacter.stats.defence);
    }

    const newHealth = Math.min(0, targetCharacter.currentHP - actualDamageValue);

    return { newHealth, damageTaken: actualDamageValue };
};
