import {
    Ability,
    BaseStatNames,
    Character,
    DamageType,
    LogMessage,
    PointModifier,
    StatModifier,
    TargetScope,
} from '../types';

import { damageCharacter } from './damageCharacter';
import { getCharacterStat } from './getCharacterStat';
import { healCharacter } from './healCharacter';
import { restoreMagicForCharacter } from './restoreMagicForCharacter';

const STATUS_EFFECT_HANDLERS: Record<
    DamageType,
    {
        getStat: (caster: Character) => number;
        apply: (
            target: Character,
            value: number,
        ) => { updatedTarget: Character; statChange: number };
    }
> = {
    [DamageType.physical]: {
        getStat: (caster) => getCharacterStat(caster, BaseStatNames.attack),
        apply: (target, value) => damageCharacter(target, value, DamageType.physical),
    },
    [DamageType.magic]: {
        getStat: (caster) => getCharacterStat(caster, BaseStatNames.magicAttack),
        apply: (target, value) => damageCharacter(target, value, DamageType.magic),
    },
    [DamageType.healing]: {
        getStat: (caster) => getCharacterStat(caster, BaseStatNames.healthPoints),
        apply: (target, value) => healCharacter(target, value),
    },
    [DamageType.magic_restore]: {
        getStat: (caster) => getCharacterStat(caster, BaseStatNames.magicPoints),
        apply: (target, value) => restoreMagicForCharacter(target, value),
    },
};

export const applyAbilityEffects = (
    initialCaster: Character,
    initialOpponent: Character,
    ability: Ability,
): { caster: Character; opponent: Character; logs: LogMessage[] } => {
    let caster = {
        ...initialCaster,
        currentMP: Math.max(0, initialCaster.currentMP - ability.cost),
    };
    let opponent = { ...initialOpponent };
    const logs: LogMessage[] = [];

    for (const effect of ability.statusEffects) {
        const isSelfTarget = effect.target === TargetScope.self;
        let currentTarget = isSelfTarget ? caster : opponent;

        // ==========================================
        // PHASE 1: Generic Modifier Application
        // ==========================================

        if (effect.modifiers.length > 0) {
            // Give each applied modifier a fresh ID so effects can stack
            const instantiatedModifiers: StatModifier[] = effect.modifiers.map((modifier) => ({
                ...modifier,
                id: crypto.randomUUID(),
            }));

            currentTarget = {
                ...currentTarget,
                modifiers: [...currentTarget.modifiers, ...instantiatedModifiers],
            };

            logs.push({
                id: crypto.randomUUID(),
                message: `${currentTarget.name} received stat modifiers from ${ability.name}.`,
            });
        }

        if (effect.duration && effect.duration > 0) {
            const newPointModifier: PointModifier = {
                id: crypto.randomUUID(),
                name: effect.name,
                damageType: effect.damageType,
                power: effect.power,
                duration: effect.duration,
            };

            currentTarget = {
                ...currentTarget,
                pointModifiers: [...currentTarget.pointModifiers, newPointModifier],
            };

            logs.push({
                id: crypto.randomUUID(),
                message: `${currentTarget.name} is afflicted with a lingering effect!`,
            });
        }

        // ==========================================
        // PHASE 2: Immediate Handler Execution
        // ==========================================

        const handler = STATUS_EFFECT_HANDLERS[effect.damageType];

        // Only apply immediate damage if the effect is NOT a DoT.
        if (handler && !effect.duration) {
            const baseStat = handler.getStat(caster);
            const calculatedValue = baseStat * effect.power;

            const { updatedTarget, statChange } = handler.apply(currentTarget, calculatedValue);
            currentTarget = updatedTarget;

            logs.push({
                id: crypto.randomUUID(),
                message: `${caster.name} used ${ability.name} on ${currentTarget.name} for ${statChange} ${effect.damageType}!`,
            });
        }

        if (isSelfTarget) {
            caster = currentTarget;
        } else {
            opponent = currentTarget;
        }
    }

    return { caster, opponent, logs };
};

export const applyPointModifierEffects = (character: Character): Character => {
    let target: Character = { ...character };
    const logs: LogMessage[] = [];

    character.pointModifiers.forEach((pointModifier: PointModifier) => {
        const handler = STATUS_EFFECT_HANDLERS[pointModifier.damageType];

        const baseStat = handler.getStat(character);
        const calculatedValue = baseStat * pointModifier.power;

        const { updatedTarget, statChange } = handler.apply(character, calculatedValue);

        target = updatedTarget;
        logs.push({
            id: crypto.randomUUID(),
            message: `${character.name} took ${statChange} ${pointModifier.damageType} from ${pointModifier.name}!`,
        });
    });

    return target;
};
