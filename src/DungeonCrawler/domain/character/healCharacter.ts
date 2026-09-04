import { Character } from '../types';

export const healCharacter = (
    target: Character,
    value: number,
): { updatedTarget: Character; healthChange: number } => {
    const newHealth = target.currentHP + value;

    const updatedTarget = { ...target, currentHP: newHealth };
    return { updatedTarget, healthChange: value };
};
