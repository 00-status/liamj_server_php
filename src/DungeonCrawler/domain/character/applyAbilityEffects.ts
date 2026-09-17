import {
    Ability,
    BaseStatNames,
    Character,
    DamageType,
    LogMessage,
    PointModifier,
    DynamicStatModifier,
    Combatant,
    Formation,
} from '../types';

import { damageCharacter } from './damageCharacter';
import { getCharacterStat } from './getCharacterStat';
import { getValidTargets } from './getValidTargets';
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
    initialCaster: Combatant,
    ability: Ability,
    initialTarget: Combatant,
    formationOfTarget: Formation,
): { updatedCombatants: { [key: string]: Combatant }; logs: LogMessage[] } => {
    const caster: Combatant = initialCaster.copyWith({
        character: {
            ...initialCaster.character,
            currentMP: Math.max(0, initialCaster.character.currentMP - ability.cost),
        },
    });

    // Clone each class instance so we don't mess anything up in the calling code.
    const combatantDictionary: { [key: string]: Combatant } = formationOfTarget.combatants.reduce<{
        [key: string]: Combatant;
    }>((acc, combatant) => {
        acc[combatant.id] = combatant.clone();
        return acc;
    }, {});
    combatantDictionary[caster.id] = caster.clone();

    const logs: LogMessage[] = [];

    for (const effect of ability.statusEffects) {
        const targets = getValidTargets(caster, initialTarget, formationOfTarget, effect.target);

        // ==========================================
        // PHASE 1: Generic Modifier Application
        // ==========================================

        if (effect.modifiers.length > 0) {
            // Give each applied modifier a fresh ID so effects can stack
            const instantiatedModifiers: DynamicStatModifier[] = effect.modifiers.map(
                (modifier) => ({
                    ...modifier,
                    id: crypto.randomUUID(),
                }),
            );

            targets.forEach((target) => {
                const targetToUpdate = combatantDictionary[target.id];
                if (!targetToUpdate) {
                    return;
                }

                targetToUpdate.character.modifiers.push(...instantiatedModifiers);

                logs.push({
                    id: crypto.randomUUID(),
                    message: `${targetToUpdate.character.name} received stat modifiers from ${ability.name}.`,
                });
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

            targets.forEach((target) => {
                const targetToUpdate = combatantDictionary[target.id];
                if (!targetToUpdate) {
                    return;
                }

                targetToUpdate.character.pointModifiers.push(newPointModifier);

                logs.push({
                    id: crypto.randomUUID(),
                    message: `${target.character.name} is afflicted with a lingering effect: ${effect.name}`,
                });
            });
        }

        // ==========================================
        // PHASE 2: Immediate Handler Execution
        // ==========================================

        const handler = STATUS_EFFECT_HANDLERS[effect.damageType];

        // Only apply immediate damage if the effect is NOT a DoT.
        if (handler && !effect.duration) {
            const baseStat = handler.getStat(caster.character);
            const calculatedValue = baseStat * effect.power;

            targets.forEach((target) => {
                const targetToUpdate = combatantDictionary[target.id];
                if (!targetToUpdate) {
                    return;
                }

                const { updatedTarget, statChange } = handler.apply(
                    target.character,
                    calculatedValue,
                );
                combatantDictionary[targetToUpdate.id] = targetToUpdate.copyWith({
                    character: updatedTarget,
                });

                logs.push({
                    id: crypto.randomUUID(),
                    message: `${caster.character.name} used ${ability.name} on ${target.character.name} for ${statChange} ${effect.damageType}!`,
                });
            });
        }
    }

    return { updatedCombatants: combatantDictionary, logs };
};

export const applyPointModifierEffects = (
    character: Character,
): { target: Character; logs: LogMessage[] } => {
    let target: Character = { ...character };
    const logs: LogMessage[] = [];

    character.pointModifiers.forEach((pointModifier: PointModifier) => {
        const handler = STATUS_EFFECT_HANDLERS[pointModifier.damageType];

        const baseStat = handler.getStat(character);
        const calculatedValue = baseStat * pointModifier.power;

        const { updatedTarget, statChange } = handler.apply(target, calculatedValue);

        target = updatedTarget;
        logs.push({
            id: crypto.randomUUID(),
            message: `${character.name} took ${statChange} ${pointModifier.damageType} from ${pointModifier.name}!`,
        });
    });

    return { target, logs };
};
