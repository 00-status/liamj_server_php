import { Combatant } from './Combatant';
import { Formation, FormationTeam } from './formation/types';
import {
    Ability,
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    Character,
    CharacterTier,
    DamageScaleMethod,
    DamageType,
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
            damageType: DamageType.PHYSICAL,
            power: 1.0,
            duration: 0,
        },
        {
            id: crypto.randomUUID(),
            name: 'MP Restore',
            target: TargetScope.self,
            damageType: DamageType.MAGIC_RESTORE,
            power: 0.2,
            duration: 0,
        },
    ],
    statusEffects: [],
};

const examplePlayer: Character = {
    id: crypto.randomUUID(),
    name: 'Jimothy the Jacked',
    tier: CharacterTier.ONE,
    currentHP: 100,
    currentMP: 6,
    stats: {
        healthPoints: 100,
        magicPoints: 6,
        attack: 20,
        magicAttack: 20,
        defence: 10,
        magicDefence: 10,
        critChance: 0,
    },
    modifiers: [],
    pointModifiers: [],
    abilities: [
        {
            name: 'Throw a Punch',
            cost: 0,
            type: AbilityType.default,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Throw a Punch (Jimothy)',
                    target: TargetScope.target,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'MP Restore (Jimothy)',
                    target: TargetScope.self,
                    damageType: DamageType.MAGIC_RESTORE,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: "The Ol' One-Two",
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: "The Ol' One-Two (Jimothy)",
                    target: TargetScope.target,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: "The Ol' One-Two (Jimothy)",
                    target: TargetScope.target,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
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
                    name: 'HP Restore (Jimothy)',
                    target: TargetScope.self,
                    damageType: DamageType.HEALING,
                    power: 0.3,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
    ],
};

const examplePlayer2: Character = {
    id: crypto.randomUUID(),
    name: 'Barry the Built',
    tier: CharacterTier.ONE,
    currentHP: 120,
    currentMP: 10,
    stats: {
        healthPoints: 120,
        magicPoints: 10,
        attack: 15,
        magicAttack: 25,
        defence: 15,
        magicDefence: 15,
        critChance: 0,
    },
    modifiers: [],
    pointModifiers: [],
    abilities: [
        {
            name: 'Throw a Punch',
            cost: 0,
            type: AbilityType.default,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Throw a Punch (Barry)',
                    target: TargetScope.target,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'MP Restore (Jimothy)',
                    target: TargetScope.self,
                    damageType: DamageType.MAGIC_RESTORE,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'YEET!',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'YEET! (Barry)',
                    target: TargetScope.target,
                    damageType: DamageType.MAGIC,
                    power: 2.0,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Body Slam',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Body Slam (Barry)',
                    target: TargetScope.target_and_surrounding,
                    damageType: DamageType.MAGIC,
                    power: 0.8,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Hype Man',
            cost: 3,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.ALLY_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Heal (Barry)',
                    target: TargetScope.entire_formation,
                    damageType: DamageType.HEALING,
                    power: 0.1,
                    duration: 0,
                },
            ],
            statusEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Hyped! (Barry)',
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
    healthPoints: 'HP',
    magicPoints: 'MP',
    attack: 'ATK',
    magicAttack: 'MATK',
    defence: 'DEF',
    magicDefence: 'MDEF',
    critChance: 'CRIT',
};
