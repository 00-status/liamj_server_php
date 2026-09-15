import { exampleEquippables } from './equippables';
import { Ability, AbilityType, Character, DamageType, TargetScope } from './types';

export const attackAbility: Ability = {
    name: 'Attack',
    cost: 0,
    type: AbilityType.default,
    statusEffects: [
        {
            name: 'Attack',
            target: TargetScope.opponent,
            damageType: DamageType.physical,
            power: 1.0,
            modifiers: [],
        },
        {
            name: 'MP Restore',
            target: TargetScope.self,
            damageType: DamageType.magic_restore,
            power: 0.2,
            modifiers: [],
        },
    ],
};

export const examplePlayer: Character = {
    name: 'Jimothy the Jacked',
    currentHP: 100,
    currentMP: 6,
    stats: {
        healthPoints: 100,
        magicPoints: 6,
        attack: 20,
        magicAttack: 20,
        defence: 10,
        magicDefence: 10,
    },
    modifiers: [],
    pointModifiers: [],
    equipables: exampleEquippables,
    abilities: [
        attackAbility,
        {
            name: 'YEET!',
            cost: 3,
            type: AbilityType.magic,
            statusEffects: [
                {
                    name: 'YEET!',
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.5,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Sweep the Leg!',
            cost: 2,
            type: AbilityType.magic,
            statusEffects: [
                {
                    name: 'Sweep the Leg!',
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.2,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Get me a beer!',
            cost: 2,
            type: AbilityType.magic,
            statusEffects: [
                {
                    name: 'HP Restore',
                    target: TargetScope.self,
                    damageType: DamageType.healing,
                    power: 0.2,
                    modifiers: [],
                },
            ],
        },
    ],
};

export const BaseStatDisplayNames = {
    healthPoints: 'Health Points',
    magicPoints: 'Magic Points',
    attack: 'Attack',
    magicAttack: 'Magic Attack',
    defence: 'Defence',
    magicDefence: 'Magic Defence',
};
