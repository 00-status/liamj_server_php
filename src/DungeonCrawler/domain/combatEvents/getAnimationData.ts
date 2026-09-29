import { CombatAnimation, CombatEvent, CombatEventType } from '../types';

export const getAnimationData = (event: CombatEvent, targetID: string): CombatAnimation | null => {
    switch (event.type) {
        case CombatEventType.APPLY_DAMAGE: {
            const damageTarget = event.damageTargets.find(
                (event) => event.targetCombatantID === targetID,
            );

            return {
                name: 'character-damage-number',
                container: 'child',
                durationMilliseconds: 600,
                combatEventType: CombatEventType.APPLY_DAMAGE,
                text: damageTarget ? String(damageTarget.amount) : '',
            };
        }
        case CombatEventType.CAST_ABILITY: {
            return {
                name: 'character-attack',
                container: 'container',
                durationMilliseconds: 300,
                combatEventType: CombatEventType.CAST_ABILITY,
                text: '',
            };
        }
        default:
            return null;
    }
};
