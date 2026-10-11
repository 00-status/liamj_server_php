import { BaseStatDisplayNames } from '../constants';
import { BaseStatModifier, DamageScaleMethod } from '../types';

export const formatModifier = (modifier: BaseStatModifier): string => {
    const formattedValue = formatModifierValue(modifier);
    const statName = BaseStatDisplayNames[modifier.stat] ?? modifier.stat;

    return `${formattedValue} ${statName}`;
};

const formatModifierValue = (modifier: BaseStatModifier): string => {
    const { value, type } = modifier;

    if (type === DamageScaleMethod.PERCENT) {
        const delta = Math.round((value - 1) * 100);
        const sign = delta >= 0 ? '+' : '';
        return `${sign}${delta}%`;
    }

    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}`;
};
