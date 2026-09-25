import {
    Ability,
    BaseStatNames,
    Character,
    DamageType,
    PointModifier,
    Combatant,
    Formation,
    CombatEvents,
    CombatEventDamageTarget,
    CombatEventType,
    DynamicStatModifier,
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
    [DamageType.magic_drain]: {
        getStat: (caster) => getCharacterStat(caster, BaseStatNames.magicPoints),
        apply: (target, value) => restoreMagicForCharacter(target, value), // TODO: Update this to drain properly.
    },
};

export const applyAbilityEffects = (
    initialCaster: Combatant,
    ability: Ability,
    initialTarget: Combatant,
    formationOfTarget: Formation,
): CombatEvents[] => {
    const caster: Combatant = initialCaster.cloneWith({
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

    const combatEvents: CombatEvents[] = [];

    combatEvents.push({
        id: crypto.randomUUID(),
        type: CombatEventType.APPLY_DAMAGE,
        isProcessed: false,
        sourceName: 'Ability Cost',
        targets: [
            {
                targetCombatantID: caster.id,
                amount: ability.cost,
                damageType: DamageType.magic_drain,
            },
        ],
    });

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

        const combatEvent: CombatEvents = {
            id: crypto.randomUUID(),
            type: CombatEventType.APPLY_STATUS_EFFECT,
            isProcessed: false,
            casterCombatantID: caster.id,
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
            const casterStatValue = handler ? handler.getStat(caster.character) : 0;

            const pointModifier: PointModifier = {
                id: crypto.randomUUID(),
                name: pointEffect.name,
                casterStatValue: casterStatValue,
                damageType: pointEffect.damageType,
                power: pointEffect.power,
                duration: pointEffect.duration,
            };

            const combatEvent: CombatEvents = {
                id: crypto.randomUUID(),
                type: CombatEventType.APPLY_POINT_EFFECT,
                isProcessed: false,
                casterCombatantID: caster.id,
                pointModifier,
                targetCombatantIDs: targets.map((target) => target.id),
            };
            combatEvents.push(combatEvent);
        }

        const handler = STATUS_EFFECT_HANDLERS[pointEffect.damageType];

        // Only apply immediate damage if the effect is NOT a DoT.
        if (handler && pointEffect.duration <= 0) {
            const baseStat = handler.getStat(caster.character);
            const calculatedValue = baseStat * pointEffect.power;

            const combatEventTargets: CombatEventDamageTarget[] = targets.map((target) => {
                const { statChange } = handler.apply(target.character, calculatedValue);

                return {
                    targetCombatantID: target.id,
                    amount: statChange,
                    damageType: pointEffect.damageType,
                };
            });

            const combatEvent: CombatEvents = {
                id: crypto.randomUUID(),
                type: CombatEventType.APPLY_DAMAGE,
                isProcessed: false,
                sourceName: pointEffect.name,
                targets: combatEventTargets,
            };
            combatEvents.push(combatEvent);
        }
    }

    return combatEvents;
};

export const applyPointModifierEffects = (
    combatantID: string,
    character: Character,
): CombatEvents[] => {
    const target: Character = { ...character };
    const combatEvents: CombatEvents[] = [];

    character.pointModifiers.forEach((pointModifier: PointModifier) => {
        const calculatedValue = pointModifier.casterStatValue * pointModifier.power;

        const handler = STATUS_EFFECT_HANDLERS[pointModifier.damageType];
        const { statChange } = handler.apply(target, calculatedValue);

        const damageEvent: CombatEvents = {
            id: crypto.randomUUID(),
            type: CombatEventType.APPLY_DAMAGE,
            isProcessed: false,
            sourceName: pointModifier.name,
            targets: [
                {
                    targetCombatantID: combatantID,
                    amount: statChange,
                    damageType: pointModifier.damageType,
                },
            ],
        };
        combatEvents.push(damageEvent);
    });

    return combatEvents;
};
