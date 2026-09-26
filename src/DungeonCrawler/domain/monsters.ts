import { attackAbility } from './constants';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    Character,
    DamageScaleMethod,
    DamageType,
    TargetScope,
} from './types';

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
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bone Bonk',
                        target: TargetScope.target,
                        damageType: DamageType.magic,
                        power: 3.0,
                        duration: 0,
                    },
                ],
                statusEffects: [],
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
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bone Bonk',
                        target: TargetScope.target,
                        damageType: DamageType.magic,
                        power: 3.0,
                        duration: 0,
                    },
                ],
                statusEffects: [],
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
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bite',
                        target: TargetScope.target,
                        damageType: DamageType.magic,
                        power: 3.0,
                        duration: 0,
                    },
                    {
                        id: crypto.randomUUID(),
                        name: 'Rot Poison',
                        target: TargetScope.target,
                        damageType: DamageType.magic,
                        power: 0.5,
                        duration: 3,
                    },
                ],
                statusEffects: [
                    {
                        id: '1',
                        name: 'Defence Drain',
                        target: TargetScope.target,
                        stat: BaseStatNames.defence,
                        value: -10,
                        damageScaleType: DamageScaleMethod.FLAT,
                        duration: 2,
                    },
                ],
            },
        ],
    },
];
