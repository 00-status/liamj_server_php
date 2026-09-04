import { Ability, AbilityType, DamageType, TargetScope } from './types';

export const attackAbility: Ability = {
    name: 'Attack',
    cost: 0,
    type: AbilityType.physical,
    statusEffects: [
        {
            target: TargetScope.opponent,
            damageType: DamageType.physical,
            power: 1.0,
            modifiers: [],
        },
    ],
};
