import { CombatAnimation, CombatEvent, CombatEventType } from '../types';

export const getAnimationData = (event: CombatEvent, targetID: string): CombatAnimation | null => {
    switch (event.type) {
        case CombatEventType.APPLY_DAMAGE: {
            const damageTarget = event.damageTargets.find(
                (target) => target.targetCombatantID === targetID,
            );

            if (!damageTarget) {
                return null;
            }

            return {
                id: crypto.randomUUID(),
                name: 'character-damage-number',
                container: 'child',
                combatEventType: CombatEventType.APPLY_DAMAGE,
                text: String(damageTarget.amount),
            };
        }
        case CombatEventType.CAST_ABILITY: {
            return {
                id: crypto.randomUUID(),
                name: 'character-attack',
                container: 'container',
                combatEventType: CombatEventType.CAST_ABILITY,
                text: '',
            };
        }
        default:
            return null;
    }
};

export const getCombatEventDuration = (event: CombatEvent): number => {
    switch (event.type) {
        case CombatEventType.APPLY_DAMAGE:
            return 600;
        case CombatEventType.CAST_ABILITY:
            return 300;
        default:
            return 0;
    }
};

export const getEventAnimationTargetIDs = (event: CombatEvent): string[] => {
    switch (event.type) {
        case CombatEventType.APPLY_DAMAGE:
            return event.damageTargets.map((target) => target.targetCombatantID);
        case CombatEventType.CAST_ABILITY:
            return [event.casterCombatantID];
        case CombatEventType.APPLY_POINT_EFFECT:
        case CombatEventType.APPLY_STATUS_EFFECT:
        case CombatEventType.DECREASE_MODIFIERS:
        case CombatEventType.RESET_TURN_TIMER:
            return [...event.targetCombatantIDs];
        default:
            return [];
    }
};
