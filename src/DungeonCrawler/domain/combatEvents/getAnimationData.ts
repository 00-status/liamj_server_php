import { CombatAnimation, CombatEvent, CombatEventType, DamageColor, DamageType } from '../types';

export const getAnimationData = (event: CombatEvent, targetID: string): CombatAnimation | null => {
    switch (event.type) {
        case CombatEventType.APPLY_DAMAGE: {
            const damageTarget = event.damageTargets.find(
                (event) => event.targetCombatantID === targetID,
            );

            return {
                name: 'damage-number',
                container: 'child',
                durationMilliseconds: 600,
                combatEventType: CombatEventType.APPLY_DAMAGE,
                color: getColor(event.damageType),
                text: damageTarget ? String(damageTarget.amount) : '',
            };
        }
        default:
            return null;
    }
};

const getColor = (damageType: DamageType): DamageColor => {
    switch (damageType) {
        case DamageType.physical:
            return DamageColor.PHYSICAL;
        case DamageType.magic_restore:
        case DamageType.magic:
            return DamageColor.MAGIC;
        case DamageType.healing:
            return DamageColor.HEALIING;
        case DamageType.magic_drain:
        default:
            return DamageColor.MAGIC_DRAIN;
    }
};
