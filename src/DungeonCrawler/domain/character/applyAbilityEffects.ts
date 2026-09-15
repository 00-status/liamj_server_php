import { Ability, BaseStatNames, Character, DamageType, LogMessage, TargetScope } from '../types';

import { damageCharacter } from './damageCharacter';
import { getCharacterStat } from './getCharacterStat';
import { healCharacter } from './healCharacter';
import { restoreMagicForCharacter } from './restoreMagicForCharacter';

const EFFECT_HANDLERS: Record<
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

    // If the effect has a duration
    //      Create a new pointModifier
    //      Add the pointModifier to the correct target.
    // If the effect has modifiers.
    //      For each modifier
    //          Create a new PointModifier
    //          Add the new PointModifier to the correct target.

    for (const effect of ability.statusEffects) {
        const handler = EFFECT_HANDLERS[effect.damageType];
        if (!handler) {
            continue;
        }

        const isSelfTarget = effect.target === TargetScope.self;
        const currentTarget = isSelfTarget ? caster : opponent;

        const baseStat = handler.getStat(caster);
        const calculatedValue = baseStat * effect.power;

        const { updatedTarget, statChange } = handler.apply(currentTarget, calculatedValue);

        if (isSelfTarget) {
            caster = updatedTarget;
        } else {
            opponent = updatedTarget;
        }

        logs.push({
            id: crypto.randomUUID(),
            message: `${caster.name} used ${ability.name} on ${currentTarget.name} for ${statChange} ${effect.damageType}!`,
        });
    }

    return { caster, opponent, logs };
};
