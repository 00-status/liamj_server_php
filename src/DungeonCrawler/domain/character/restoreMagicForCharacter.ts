import { Character } from '../types';

export const restoreMagicForCharacter = (
    target: Character,
    value: number,
): { updatedTarget: Character; statChange: number } => {
    const magicPoints = Math.round(value);
    const newMagicPointValue = Math.min(target.stats.magicPoints, target.currentMP + magicPoints);

    const updatedTarget = { ...target, currentMP: newMagicPointValue };
    return { updatedTarget, statChange: magicPoints };
};
