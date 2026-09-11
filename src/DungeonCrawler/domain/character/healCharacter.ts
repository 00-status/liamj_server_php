import { BaseStatNames, Character } from '../types';

import { getCharacterStat } from './getCharacterStat';

export const healCharacter = (
    target: Character,
    value: number,
): { updatedTarget: Character; statChange: number } => {
    const mealthPoints = Math.round(value);
    const newHealth = Math.min(
        getCharacterStat(target, BaseStatNames.healthPoints),
        target.currentHP + mealthPoints,
    );

    const updatedTarget = { ...target, currentHP: newHealth };
    return { updatedTarget, statChange: mealthPoints };
};
