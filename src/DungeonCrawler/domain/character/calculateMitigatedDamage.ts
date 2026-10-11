import { BaseStatNames, Character, DamageType, Equipment } from '../types';

import { getCharacterStat } from './getCharacterStat';

const MAX_DAMAGE_REDUCTION = 0.8;

export const calculateMitigatedDamage = (
    targetCharacter: Character,
    characterEquippables: Equipment[],
    damageValue: number,
    damageType: DamageType,
): number => {
    switch (damageType) {
        case DamageType.MAGIC: {
            const magicDefence = calculateMagicDefence(targetCharacter, characterEquippables);
            const damageMultiplier = Math.max(magicDefence, 1.0 - MAX_DAMAGE_REDUCTION);

            return Math.max(1, Math.round(damageValue * damageMultiplier));
        }
        case DamageType.PHYSICAL:
        default: {
            const defence = calculateDefence(targetCharacter, characterEquippables);
            const damageMultiplier = Math.max(defence, 1.0 - MAX_DAMAGE_REDUCTION);

            return Math.max(1, Math.round(damageValue * damageMultiplier));
        }
    }
};

const DEFENCE_SCALING_FACTOR = 100;
const MAGIC_DEFENCE_SCALING_FACTOR = 100;

const calculateDefence = (character: Character, characterEquippables: Equipment[]): number => {
    return (
        DEFENCE_SCALING_FACTOR /
        (DEFENCE_SCALING_FACTOR +
            getCharacterStat(character, characterEquippables, BaseStatNames.defence))
    );
};

const calculateMagicDefence = (character: Character, characterEquippables: Equipment[]): number => {
    return (
        MAGIC_DEFENCE_SCALING_FACTOR /
        (MAGIC_DEFENCE_SCALING_FACTOR +
            getCharacterStat(character, characterEquippables, BaseStatNames.magicDefence))
    );
};
