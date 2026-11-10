import type { Combatant } from '../Combatant';
import type { Formation } from '../formation/types';
import type {
    Ability,
    Character,
    PointModifier,
    CombatEvent,
    CombatEventDamageTarget,
    DynamicStatModifier,
    Equipment,
} from '../types';
import { BaseStatNames, DamageType, CombatEventType, DamageScaleMethod } from '../types';

import { calculateMitigatedDamage } from './calculateMitigatedDamage';
import { getCharacterStat } from './getCharacterStat';
import { getValidTargets } from './getValidTargets';

const DAMAGE_TYPE_HANDLERS: Record<
    DamageType,
    {
        apply: (target: Character, targetEquippables: Equipment[], value: number) => number;
    }
> = {
    [DamageType.PHYSICAL]: {
        apply: (target, targetEquippables, value) =>
            calculateMitigatedDamage(target, targetEquippables, value, DamageType.PHYSICAL),
    },
    [DamageType.MAGIC]: {
        apply: (target, targetEquippables, value) =>
            calculateMitigatedDamage(target, targetEquippables, value, DamageType.MAGIC),
    },
    [DamageType.HEALING]: {
        apply: (target, targetEquippables, value) => Math.max(1, Math.round(value)),
    },
    [DamageType.MAGIC_RESTORE]: {
        apply: (target, targetEquippables, value) => Math.max(1, Math.round(value)),
    },
    [DamageType.MAGIC_DRAIN]: {
        apply: (target, targetEquippables, value) => Math.max(1, Math.round(value)),
    },
};

export const applyAbilityEffects = (
    caster: Combatant,
    ability: Ability,
    initialTarget: Combatant,
    formationOfTarget: Formation,
    purchasedEquippables: Equipment[],
): CombatEvent[] => {
    const casterEquippables = purchasedEquippables.filter(
        (equippable) => equippable.characterID === caster.character.id,
    );
    const combatEvents: CombatEvent[] = [];

    if (ability.cost > 0) {
        combatEvents.push({
            id: crypto.randomUUID(),
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: 'Ability Cost',
            damageType: DamageType.MAGIC_DRAIN,
            damageTargets: [
                {
                    targetCombatantID: caster.id,
                    amount: ability.cost,
                },
            ],
        });
    }

    for (const statusEffect of ability.statusEffects) {
        const targets = getValidTargets(
            caster,
            initialTarget,
            formationOfTarget,
            statusEffect.target,
        );

        const casterScalingStat = getCharacterStat(
            caster.character,
            casterEquippables,
            statusEffect.scalingStat,
        );
        const scalingStatProduct = casterScalingStat * statusEffect.power;
        let statModiferValue = 0.8 * (scalingStatProduct / (scalingStatProduct + 100));
        if (statusEffect.isBuff) {
            statModiferValue += 1;
        }

        const statusModifier: DynamicStatModifier = {
            id: crypto.randomUUID(),
            stat: statusEffect.targetStat,
            value: statModiferValue,
            type: DamageScaleMethod.PERCENT,
            name: statusEffect.name,
            duration: statusEffect.duration,
        };

        const combatEvent: CombatEvent = {
            id: crypto.randomUUID(),
            type: CombatEventType.APPLY_STATUS_EFFECT,
            isProcessed: false,
            statModifier: statusModifier,
            targetCombatantIDs: targets.map((target) => target.id),
        };
        combatEvents.push(combatEvent);
    }

    for (const pointEffect of ability.pointEffects) {
        const targets = getValidTargets(
            caster,
            initialTarget,
            formationOfTarget,
            pointEffect.target,
        );

        if (pointEffect.duration > 0) {
            const casterScalingStat = getCharacterStat(
                caster.character,
                casterEquippables,
                pointEffect.scalingStat,
            );

            const pointModifier: PointModifier = {
                id: crypto.randomUUID(),
                name: pointEffect.name,
                casterStatValue: casterScalingStat,
                damageType: pointEffect.damageType,
                power: pointEffect.power,
                duration: pointEffect.duration,
            };

            const combatEvent: CombatEvent = {
                id: crypto.randomUUID(),
                type: CombatEventType.APPLY_POINT_EFFECT,
                isProcessed: false,
                targetCombatantIDs: targets.map((target) => target.id),
                pointModifier,
            };
            combatEvents.push(combatEvent);
        }

        const handler = DAMAGE_TYPE_HANDLERS[pointEffect.damageType];

        // Only apply immediate damage if the effect is NOT a DoT.
        if (handler && pointEffect.duration <= 0) {
            const modifiedScalingStat = getCharacterStat(
                caster.character,
                casterEquippables,
                pointEffect.scalingStat,
            );
            const scalingStatProduct = modifiedScalingStat * pointEffect.power;

            const isPhysical = pointEffect.damageType === DamageType.PHYSICAL;
            const critChance = isPhysical
                ? getCharacterStat(caster.character, casterEquippables, BaseStatNames.critChance)
                : 0;

            const combatEventTargets: CombatEventDamageTarget[] = targets.map((target) => {
                const targetEquippables = purchasedEquippables.filter(
                    (equippable) => equippable.characterID === target.character.id,
                );
                const isCritical = isPhysical && caster.rollCrit(critChance);
                const effectiveValue = isCritical ? scalingStatProduct * 2 : scalingStatProduct;

                const statChange = handler.apply(
                    target.character,
                    targetEquippables,
                    effectiveValue,
                );

                return {
                    targetCombatantID: target.id,
                    amount: statChange,
                    isCritical,
                };
            });

            if (isPhysical || pointEffect.damageType === DamageType.MAGIC) {
                combatEvents.push({
                    id: crypto.randomUUID(),
                    type: CombatEventType.CAST_DAMAGE_ABILITY,
                    isProcessed: false,
                    casterCombatantID: caster.id,
                    abilityID: ability.name,
                });
            }

            const combatEvent: CombatEvent = {
                id: crypto.randomUUID(),
                type: CombatEventType.APPLY_DAMAGE,
                isProcessed: false,
                sourceName: pointEffect.name,
                damageType: pointEffect.damageType,
                damageTargets: combatEventTargets,
            };
            combatEvents.push(combatEvent);
        }
    }

    return combatEvents;
};

export const applyPointModifierEffects = (
    combatantID: string,
    purchasedEquippables: Equipment[],
    character: Character,
): CombatEvent[] => {
    const target: Character = { ...character };
    const combatEvents: CombatEvent[] = [];

    character.pointModifiers.forEach((pointModifier: PointModifier) => {
        const targetEquippables = purchasedEquippables.filter(
            (equippable) => equippable.characterID === target.id,
        );
        const calculatedValue = pointModifier.casterStatValue * pointModifier.power;

        const handler = DAMAGE_TYPE_HANDLERS[pointModifier.damageType];
        const statChange = handler.apply(target, targetEquippables, calculatedValue);

        const damageEvent: CombatEvent = {
            id: crypto.randomUUID(),
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: pointModifier.name,
            damageType: pointModifier.damageType,
            damageTargets: [
                {
                    targetCombatantID: combatantID,
                    amount: statChange,
                },
            ],
        };
        combatEvents.push(damageEvent);
    });

    return combatEvents;
};
