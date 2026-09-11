import { BaseStatNames, Character } from '../types';

import { getCharacterStat } from './getCharacterStat';

export const restoreMagicForCharacter = (
    target: Character,
    value: number,
): { updatedTarget: Character; statChange: number } => {
    const magicPoints = Math.round(value);
    const newMagicPointValue = Math.min(
        getCharacterStat(target, BaseStatNames.magicPoints),
        target.currentMP + magicPoints,
    );

    const updatedTarget = { ...target, currentMP: newMagicPointValue };
    return { updatedTarget, statChange: magicPoints };
};
