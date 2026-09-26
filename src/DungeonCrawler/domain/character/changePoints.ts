import { BaseStatNames, Character, DamageType } from '../types';

import { getCharacterStat } from './getCharacterStat';

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
                getCharacterStat(character, BaseStatNames.healthPoints),
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.healing: {
            const newHealthPoints = Math.min(
                Math.max(character.currentHP + pointChange, MINIMUM_POINTS),
                getCharacterStat(character, BaseStatNames.healthPoints),
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.magic_restore: {
            const newMagicPoints = Math.min(
                Math.max(character.currentMP + pointChange, MINIMUM_POINTS),
                getCharacterStat(character, BaseStatNames.magicPoints),
            );
            return { ...character, currentMP: newMagicPoints };
        }
        case DamageType.magic_drain: {
            const newMagicPoints = Math.min(
                Math.max(character.currentMP - pointChange, MINIMUM_POINTS),
                getCharacterStat(character, BaseStatNames.magicPoints),
            );
            return { ...character, currentMP: newMagicPoints };
        }
        default:
            return { ...character };
    }
};
