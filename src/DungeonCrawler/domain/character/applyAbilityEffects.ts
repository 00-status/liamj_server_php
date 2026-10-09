import {
    Ability,
    BaseStatNames,
    Character,
    DamageType,
    PointModifier,
    Combatant,
    Formation,
    CombatEvent,
    CombatEventDamageTarget,
    CombatEventType,
    DynamicStatModifier,
    Equipment,
} from '../types';

import { calculateMitigatedDamage } from './calculateMitigatedDamage';
import { getCharacterStat } from './getCharacterStat';
import { getValidTargets } from './getValidTargets';

const STATUS_EFFECT_HANDLERS: Record<
    DamageType,
    {
        getStat: (caster: Character, casterEquippables: Equipment[]) => number;
        apply: (target: Character, targetEquippables: Equipment[], value: number) => number;
    }
> = {
    [DamageType.PHYSICAL]: {
        getStat: (caster, casterEquippables) =>
            getCharacterStat(caster, casterEquippables, BaseStatNames.attack),
        apply: (target, targetEquippables, value) =>
            calculateMitigatedDamage(target, targetEquippables, value, DamageType.PHYSICAL),
    },
    [DamageType.MAGIC]: {
        getStat: (caster, casterEquippables) =>
            getCharacterStat(caster, casterEquippables, BaseStatNames.magicAttack),
        apply: (target, targetEquippables, value) =>
            calculateMitigatedDamage(target, targetEquippables, value, DamageType.MAGIC),
    },
    [DamageType.HEALING]: {
        getStat: (caster, casterEquippables) =>
            getCharacterStat(caster, casterEquippables, BaseStatNames.healthPoints),
        apply: (target, targetEquippables, value) => Math.round(value),
    },
    [DamageType.MAGIC_RESTORE]: {
        getStat: (caster, casterEquippables) =>
            getCharacterStat(caster, casterEquippables, BaseStatNames.magicPoints),
        apply: (target, targetEquippables, value) => Math.round(value),
    },
    [DamageType.MAGIC_DRAIN]: {
        getStat: (caster, casterEquippables) =>
            getCharacterStat(caster, casterEquippables, BaseStatNames.magicPoints),
        apply: (target, targetEquippables, value) => Math.round(value),
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

    combatEvents.push({
        id: crypto.randomUUID(),
        type: CombatEventType.CAST_ABILITY,
        isProcessed: false,
        casterCombatantID: caster.id,
        abilityID: ability.name,
    });

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

        const statusModifier: DynamicStatModifier = {
            id: crypto.randomUUID(),
            stat: statusEffect.stat,
            value: statusEffect.value,
            type: statusEffect.damageScaleType,
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
            const handler = STATUS_EFFECT_HANDLERS[pointEffect.damageType];
            const casterStatValue = handler
                ? handler.getStat(caster.character, casterEquippables)
                : 0;

            const pointModifier: PointModifier = {
                id: crypto.randomUUID(),
                name: pointEffect.name,
                casterStatValue: casterStatValue,
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

        const handler = STATUS_EFFECT_HANDLERS[pointEffect.damageType];

        // Only apply immediate damage if the effect is NOT a DoT.
        if (handler && pointEffect.duration <= 0) {
            const baseStat = handler.getStat(caster.character, casterEquippables);
            const calculatedValue = baseStat * pointEffect.power;

            const combatEventTargets: CombatEventDamageTarget[] = targets.map((target) => {
                const targetEquippables = purchasedEquippables.filter(
                    (equippable) => equippable.characterID === target.id,
                );
                const statChange = handler.apply(
                    target.character,
                    targetEquippables,
                    calculatedValue,
                );

                return {
                    targetCombatantID: target.id,
                    amount: statChange,
                };
            });

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

        const handler = STATUS_EFFECT_HANDLERS[pointModifier.damageType];
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
