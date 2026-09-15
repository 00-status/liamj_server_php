import { attackAbility } from './constants';
import { AbilityType, BaseStatNames, Character, DamageType, TargetScope } from './types';

export const exampleMonsters: Character[] = [
    {
        name: 'Skeleton',
        currentHP: 50,
        currentMP: 0,
        stats: {
            healthPoints: 50,
            magicPoints: 3,
            attack: 10,
            magicAttack: 10,
            defence: 20,
            magicDefence: 20,
        },
        modifiers: [],
        pointModifiers: [],
        equipables: [],
        abilities: [
            attackAbility,
            {
                name: 'Bone Bonk',
                cost: 3,
                type: AbilityType.magic,
                statusEffects: [
                    {
                        name: 'Bone Bonk',
                        target: TargetScope.opponent,
                        damageType: DamageType.magic,
                        power: 3.0,
                        modifiers: [],
                    },
                ],
            },
        ],
    },
    {
        name: 'Armoured Skeleton',
        currentHP: 50,
        currentMP: 0,
        stats: {
            healthPoints: 50,
            magicPoints: 5,
            attack: 10,
            magicAttack: 10,
            defence: 50,
            magicDefence: 20,
        },
        modifiers: [],
        pointModifiers: [],
        equipables: [],
        abilities: [
            attackAbility,
            {
                name: 'Bone Bonk',
                cost: 3,
                type: AbilityType.magic,
                statusEffects: [
                    {
                        name: 'Bone Bonk',
                        target: TargetScope.opponent,
                        damageType: DamageType.magic,
                        power: 3.0,
                        modifiers: [],
                    },
                ],
            },
        ],
    },
    {
        name: 'Zombie',
        currentHP: 120,
        currentMP: 0,
        stats: {
            healthPoints: 120,
            magicPoints: 4,
            attack: 15,
            magicAttack: 5,
            defence: 20,
            magicDefence: 20,
        },
        modifiers: [],
        pointModifiers: [],
        equipables: [],
        abilities: [
            attackAbility,
            {
                name: 'Bite',
                cost: 4,
                type: AbilityType.magic,
                statusEffects: [
                    {
                        name: 'Bite',
                        target: TargetScope.opponent,
                        damageType: DamageType.magic,
                        power: 3.0,
                        modifiers: [
                            {
                                id: '1',
                                stat: BaseStatNames.defence,
                                value: -10,
                                type: 'flat',
                                durationTurns: 2,
                            },
                        ],
                    },
                ],
            },
        ],
    },
];
