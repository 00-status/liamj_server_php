import { Ability, Character, DamageType, LogMessage, TargetScope } from '../types';

import { damageCharacter } from './damageCharacter';
import { healCharacter } from './healCharacter';

const EFFECT_HANDLERS: Record<
    DamageType,
    {
        getStat: (caster: Character) => number;
        apply: (
            target: Character,
            value: number,
        ) => { updatedTarget: Character; healthChange: number };
    }
> = {
    [DamageType.physical]: {
        getStat: (caster) => caster.stats.attack,
        apply: (target, value) => damageCharacter(target, value, DamageType.physical),
    },
    [DamageType.magic]: {
        getStat: (caster) => caster.stats.magicAttack,
        apply: (target, value) => damageCharacter(target, value, DamageType.magic),
    },
    [DamageType.healing]: {
        getStat: (caster) => caster.stats.magicAttack,
        apply: (target, value) => healCharacter(target, value),
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
        const handler = EFFECT_HANDLERS[effect.damageType];
        if (!handler) {
            continue;
        }

        const isSelfTarget = effect.target === TargetScope.self;
        const currentTarget = isSelfTarget ? caster : opponent;

        const baseStat = handler.getStat(caster);
        const calculatedValue = baseStat * effect.power;

        const { updatedTarget, healthChange } = handler.apply(currentTarget, calculatedValue);

        if (isSelfTarget) {
            caster = updatedTarget;
        } else {
            opponent = updatedTarget;
        }

        logs.push({
            id: crypto.randomUUID(),
            message: `${caster.name} used ${ability.name} on ${currentTarget.name} for ${healthChange} ${effect.damageType}!`,
        });
    }

    return { caster, opponent, logs };
};
