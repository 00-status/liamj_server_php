import type { Ability } from '../types';
import { BaseStatNames } from '../types';

export const calculatePrimaryAbilityStat = (ability: Ability): BaseStatNames | null => {
    const pointEffects = ability.pointEffects;

    if (pointEffects.length <= 0) {
        return null;
    }

    let hasMagicPointEffect = false;
    let hasPhysicalPointEffect = false;
    let hasMindPointEffect = false;
    pointEffects.forEach((pointEffect) => {
        if (pointEffect.scalingStat === BaseStatNames.attack) {
            hasPhysicalPointEffect = true;
        }

        if (pointEffect.scalingStat === BaseStatNames.magicAttack) {
            hasMagicPointEffect = true;
        }

        if (pointEffect.scalingStat === BaseStatNames.mind) {
            hasMindPointEffect = true;
        }
    });

    if (hasPhysicalPointEffect && !hasMagicPointEffect && !hasMindPointEffect) {
        return BaseStatNames.attack;
    }

    if (!hasPhysicalPointEffect && hasMagicPointEffect && !hasMindPointEffect) {
        return BaseStatNames.magicAttack;
    }

    if (!hasPhysicalPointEffect && !hasMagicPointEffect && hasMindPointEffect) {
        return BaseStatNames.mind;
    }

    return null;
};
