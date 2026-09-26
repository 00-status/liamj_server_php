import { exampleEquippables } from './equippables';
import {
    Ability,
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    Character,
    Combatant,
    DamageScaleMethod,
    DamageType,
    Formation,
    FormationTeam,
    TargetScope,
} from './types';

export const attackAbility: Ability = {
    name: 'Attack',
    cost: 0,
    type: AbilityType.default,
    abilityTarget: AbilityTarget.OPPONENT_FORMATION,
    pointEffects: [
        {
            id: crypto.randomUUID(),
            name: 'Attack',
            target: TargetScope.target,
            damageType: DamageType.physical,
            power: 1.0,
            duration: 0,
        },
        {
            id: crypto.randomUUID(),
            name: 'MP Restore',
            target: TargetScope.self,
            damageType: DamageType.magic_restore,
            power: 0.2,
            duration: 0,
        },
    ],
    statusEffects: [],
};

const examplePlayer: Character = {
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
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'YEET!',
                    target: TargetScope.target,
                    damageType: DamageType.magic,
                    power: 1.5,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Sweep the Leg!',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Sweep the Leg!',
                    target: TargetScope.target_and_adjacent,
                    damageType: DamageType.magic,
                    power: 1.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Get me a beer!',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.SELF,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'HP Restore',
                    target: TargetScope.self,
                    damageType: DamageType.healing,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
    ],
};

const examplePlayer2: Character = {
    name: 'Barry the Built',
    currentHP: 120,
    currentMP: 10,
    stats: {
        healthPoints: 120,
        magicPoints: 10,
        attack: 15,
        magicAttack: 25,
        defence: 15,
        magicDefence: 15,
    },
    modifiers: [],
    pointModifiers: [],
    equipables: [],
    abilities: [
        attackAbility,
        {
            name: 'Hype Man',
            cost: 3,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.ALLY_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Heal',
                    target: TargetScope.target,
                    damageType: DamageType.healing,
                    power: 0.1,
                    duration: 0,
                },
            ],
            statusEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Hyped!',
                    target: TargetScope.target,
                    duration: 3,
                    stat: BaseStatNames.attack,
                    value: 15,
                    damageScaleType: DamageScaleMethod.FLAT,
                },
            ],
        },
    ],
};

export const examplePlayerFormation: Formation = {
    id: crypto.randomUUID(),
    team: FormationTeam.PLAYER,
    combatants: [
        new Combatant(crypto.randomUUID(), examplePlayer, { x: 1, y: 1 }),
        new Combatant(crypto.randomUUID(), examplePlayer2, { x: 2, y: 1 }),
    ],
    gridDimensions: { x: 2, y: 1 },
};

export const BaseStatDisplayNames = {
    healthPoints: 'Health Points',
    magicPoints: 'Magic Points',
    attack: 'Attack',
    magicAttack: 'Magic Attack',
    defence: 'Defence',
    magicDefence: 'Magic Defence',
};
