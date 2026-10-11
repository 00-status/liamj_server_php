import { BaseStatNames, Character, DamageType, Equipment } from '../types';

import { getCharacterStat } from './getCharacterStat';

const MINIMUM_POINTS = 0;

export const changePoints = (
    character: Character,
    characterEquippables: Equipment[],
    pointChange: number,
    damageType: DamageType,
): Character => {
    switch (damageType) {
        case DamageType.MAGIC:
        case DamageType.PHYSICAL: {
            const newHealthPoints = Math.min(
                Math.max(character.currentHP - pointChange, MINIMUM_POINTS),
                getCharacterStat(character, characterEquippables, BaseStatNames.healthPoints),
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.HEALING: {
            const newHealthPoints = Math.min(
                Math.max(character.currentHP + pointChange, MINIMUM_POINTS),
                getCharacterStat(character, characterEquippables, BaseStatNames.healthPoints),
            );
            return { ...character, currentHP: newHealthPoints };
        }
        case DamageType.MAGIC_RESTORE: {
            const newMagicPoints = Math.min(
                Math.max(character.currentMP + pointChange, MINIMUM_POINTS),
                getCharacterStat(character, characterEquippables, BaseStatNames.magicPoints),
            );
            return { ...character, currentMP: newMagicPoints };
        }
        case DamageType.MAGIC_DRAIN: {
            const newMagicPoints = Math.min(
                Math.max(character.currentMP - pointChange, MINIMUM_POINTS),
                getCharacterStat(character, characterEquippables, BaseStatNames.magicPoints),
            );
            return { ...character, currentMP: newMagicPoints };
        }
        default:
            return { ...character };
    }
};
