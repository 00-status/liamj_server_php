import type { Ability} from '../types';
import { DamageType } from '../types';

export const calculatePrimaryAbilityDamageType = (ability: Ability): DamageType | null => {
    const pointEffects = ability.pointEffects;

    if (pointEffects.length <= 0) {
        return null;
    }

    let hasMagicPointEffect = false;
    let hasPhysicalPointEffect = false;
    pointEffects.forEach((pointEffect) => {
        if (pointEffect.damageType === DamageType.PHYSICAL) {
            hasPhysicalPointEffect = true;
        }

        if (pointEffect.damageType === DamageType.MAGIC) {
            hasMagicPointEffect = true;
        }
    });

    if (hasPhysicalPointEffect && hasMagicPointEffect) {
        return null;
    }

    if (hasPhysicalPointEffect && !hasMagicPointEffect) {
        return DamageType.PHYSICAL;
    }

    if (!hasPhysicalPointEffect && hasMagicPointEffect) {
        return DamageType.MAGIC;
    }

    return null;
};
