import { Character, DamageType } from '../types';

const MINIMUM_POINTS = 0;

export const changeHealthPoints = (
    character: Character,
    pointChange: number,
    damageType: DamageType,
): Character => {
    switch (damageType) {
        case DamageType.magic:
        case DamageType.physical: {
            const newHealthPoints = Math.min(
                Math.max(character.currentHP - pointChange, MINIMUM_POINTS),
                character.stats.healthPoints,
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.healing: {
            const newHealthPoints = Math.min(
                Math.max(character.currentHP + pointChange, MINIMUM_POINTS),
                character.stats.healthPoints,
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.magic_restore: {
            const newHealthPoints = Math.min(
                Math.max(character.currentMP + pointChange, MINIMUM_POINTS),
                character.stats.magicPoints,
            );
            return { ...character, currentMP: newHealthPoints };
        }
        case DamageType.magic_drain: {
            const newHealthPoints = Math.min(
                Math.max(character.currentMP + pointChange, MINIMUM_POINTS),
                character.stats.magicPoints,
            );
            return { ...character, currentMP: newHealthPoints };
        }
        default:
            return { ...character };
    }
};
