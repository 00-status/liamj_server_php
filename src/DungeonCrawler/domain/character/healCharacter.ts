import { Character } from '../types';

export const healCharacter = (
    target: Character,
    value: number,
): { updatedTarget: Character; statChange: number } => {
    const mealthPoints = Math.round(value);
    const newHealth = Math.min(target.stats.healthPoints, target.currentHP + mealthPoints);

    const updatedTarget = { ...target, currentHP: newHealth };
    return { updatedTarget, statChange: mealthPoints };
};
