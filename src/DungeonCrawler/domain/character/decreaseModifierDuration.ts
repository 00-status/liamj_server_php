import { Character, LogMessage, PointModifier, DynamicStatModifier } from '../types';

export const decreaseModifierDuration = (
    character: Character,
): { newCharacter: Character; logs: LogMessage[] } => {
    const logs: LogMessage[] = [];

    const remainingPointModifiers = character.pointModifiers
        .map((pointModifier) => {
            return { ...pointModifier, duration: pointModifier.duration - 1 };
        })
        .filter((pointModifier: PointModifier) => {
            const isExpired = pointModifier.duration <= 0;
            if (isExpired) {
                logs.push({
                    id: crypto.randomUUID(),
                    message: `${character.name} is no longer affected by ${pointModifier.name}`,
                });
            }

            return !isExpired;
        });

    const remainingStatModifiers = character.modifiers
        .map((statModifier: DynamicStatModifier) => {
            return { ...statModifier, duration: statModifier.durationTurns - 1 };
        })
        .filter((statModifier: DynamicStatModifier) => {
            const isExpired = statModifier.durationTurns <= 0;
            if (isExpired) {
                logs.push({
                    id: crypto.randomUUID(),
                    message: `${character.name} is no longer affected by ${statModifier.name}`,
                });
            }

            return !isExpired;
        });

    return {
        newCharacter: {
            ...character,
            pointModifiers: remainingPointModifiers,
            modifiers: remainingStatModifiers,
        },
        logs,
    };
};
