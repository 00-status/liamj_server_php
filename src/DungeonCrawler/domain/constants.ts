import { Combatant } from './Combatant';
import type { Formation } from './formation/types';
import { FormationTeam } from './formation/types';
import type { Ability, Character, RoomTemplate } from './types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    CharacterTier,
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
            scalingStat: BaseStatNames.attack,
            damageType: DamageType.PHYSICAL,
            power: 1.0,
            duration: 0,
        },
        {
            id: crypto.randomUUID(),
            name: 'MP Restore',
            target: TargetScope.self,
            scalingStat: BaseStatNames.magicPoints,
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
        mind: 30,
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
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'MP Restore (Jimothy)',
                    target: TargetScope.self,
                    scalingStat: BaseStatNames.magicPoints,
                    damageType: DamageType.MAGIC_RESTORE,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: "The Ol' One-Two",
            cost: 1,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: "The Ol' One-Two (Jimothy)",
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: "The Ol' One-Two (Jimothy)",
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
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
                    scalingStat: BaseStatNames.mind,
                    damageType: DamageType.HEALING,
                    power: 1,
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
        mind: 10,
    },
    modifiers: [],
    pointModifiers: [],
    abilities: [
        {
            name: 'High Kick',
            cost: 0,
            type: AbilityType.default,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'High Kick (Barry)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'MP Restore (Barry)',
                    target: TargetScope.self,
                    scalingStat: BaseStatNames.magicPoints,
                    damageType: DamageType.MAGIC_RESTORE,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'YEET!',
            cost: 4,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'YEET! (Barry)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.magicAttack,
                    damageType: DamageType.MAGIC,
                    power: 2.0,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Body Slam',
            cost: 3,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Body Slam (Barry)',
                    target: TargetScope.target_and_surrounding,
                    scalingStat: BaseStatNames.magicAttack,
                    damageType: DamageType.MAGIC,
                    power: 0.8,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Hype Man',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.ALLY_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Heal (Barry)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    damageType: DamageType.HEALING,
                    power: 0.5,
                    duration: 0,
                },
            ],
            statusEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Hyped! (Barry)',
                    isBuff: true,
                    power: 1.1,
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    duration: 3,
                    targetStat: BaseStatNames.attack,
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

const plusShape: RoomTemplate = {
    floorCountRequirement: 1,
    slots: [
        { position: { x: 2, y: 1 }, threatWeight: 0.15 },
        { position: { x: 1, y: 2 }, threatWeight: 0.15 },
        { position: { x: 2, y: 2 }, threatWeight: 0.4 },
        { position: { x: 3, y: 2 }, threatWeight: 0.15 },
        { position: { x: 2, y: 3 }, threatWeight: 0.15 },
    ],
};
const xShape: RoomTemplate = {
    floorCountRequirement: 1,
    slots: [
        { position: { x: 1, y: 1 }, threatWeight: 0.2 },
        { position: { x: 3, y: 1 }, threatWeight: 0.2 },
        { position: { x: 2, y: 2 }, threatWeight: 0.2 },
        { position: { x: 1, y: 3 }, threatWeight: 0.2 },
        { position: { x: 3, y: 3 }, threatWeight: 0.2 },
    ],
};
const rowShape: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        { position: { x: 1, y: 2 }, threatWeight: 1 },
        { position: { x: 2, y: 2 }, threatWeight: 1 },
        { position: { x: 3, y: 2 }, threatWeight: 1 },
    ],
};
const frontlineBacklineShape: RoomTemplate = {
    floorCountRequirement: 2,
    slots: [
        { position: { x: 1, y: 2 }, threatWeight: 1 },
        { position: { x: 2, y: 2 }, threatWeight: 1 },
        { position: { x: 3, y: 2 }, threatWeight: 1 },
        { position: { x: 1, y: 3 }, threatWeight: 1 },
        { position: { x: 2, y: 3 }, threatWeight: 1 },
        { position: { x: 3, y: 3 }, threatWeight: 1 },
    ],
};
const triforce: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        { position: { x: 2, y: 1 }, threatWeight: 0.5 },
        { position: { x: 1, y: 2 }, threatWeight: 0.25 },
        { position: { x: 3, y: 2 }, threatWeight: 0.25 },
    ],
};
const splitDuo: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        { position: { x: 1, y: 2 }, threatWeight: 0.5 },
        { position: { x: 3, y: 2 }, threatWeight: 0.5 },
    ],
};
const solo: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [{ position: { x: 2, y: 2 }, threatWeight: 1 }],
};
export const roomTemplates: RoomTemplate[] = [
    plusShape,
    xShape,
    rowShape,
    frontlineBacklineShape,
    triforce,
    splitDuo,
    solo,
];
