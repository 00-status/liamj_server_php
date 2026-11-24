import { Combatant } from './Combatant';
import type { Formation } from './formation/types';
import { FormationTeam } from './formation/types';
import type { Ability, Character, RoomTemplate } from './types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    CharacterRole,
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
    currentHP: 150,
    currentMP: 6,
    stats: {
        healthPoints: 150,
        magicPoints: 6,
        attack: 20,
        magicAttack: 10,
        defence: 10,
        magicDefence: 10,
        critChance: 0,
        mind: 40,
    },
    modifiers: [],
    pointModifiers: [],
    abilities: [
        {
            name: 'Hype Man',
            cost: 0,
            type: AbilityType.default,
            abilityTarget: AbilityTarget.ALLY_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Hype Man (Jimothy)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    damageType: DamageType.HEALING,
                    power: 0.5,
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
            statusEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Hype Man (Jimmy)',
                    isBuff: true,
                    power: 0.5,
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    duration: 3,
                    targetStat: BaseStatNames.attack,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'Hype Man (Jimmy)',
                    isBuff: true,
                    power: 0.5,
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    duration: 3,
                    targetStat: BaseStatNames.magicAttack,
                },
            ],
        },
        {
            name: 'The Five-Point-Palm',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'The Five-Point-Palm (Jimothy)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 2,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Buckle Up',
            cost: 3,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.ALLY_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Buckle Up (Jimmy)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    damageType: DamageType.HEALING,
                    power: 0.2,
                    duration: 0,
                },
            ],
            statusEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Buckle Up (Jimmy)',
                    isBuff: true,
                    power: 1.0,
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    duration: 3,
                    targetStat: BaseStatNames.defence,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'Buckle Up (Jimmy)',
                    isBuff: true,
                    power: 1.0,
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.mind,
                    duration: 3,
                    targetStat: BaseStatNames.magicDefence,
                },
            ],
        },
    ],
};

const examplePlayer2: Character = {
    id: crypto.randomUUID(),
    name: 'Tina the Tank',
    currentHP: 200,
    currentMP: 6,
    stats: {
        healthPoints: 200,
        magicPoints: 6,
        attack: 25,
        magicAttack: 10,
        defence: 20,
        magicDefence: 20,
        critChance: 0,
        mind: 10,
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
                    name: 'Throw a Punch (Tina)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: 'MP Restore (Tina)',
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
                    name: "The Ol' One-Two (Tina)",
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
                {
                    id: crypto.randomUUID(),
                    name: "The Ol' One-Two (Tina)",
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
            name: 'Sweep the Leg',
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Sweep the Leg (Tina)',
                    target: TargetScope.target_and_adjacent,
                    scalingStat: BaseStatNames.attack,
                    damageType: DamageType.PHYSICAL,
                    power: 0.5,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
    ],
};

const examplePlayer3: Character = {
    id: crypto.randomUUID(),
    name: 'Barry the Built',
    currentHP: 100,
    currentMP: 10,
    stats: {
        healthPoints: 100,
        magicPoints: 10,
        attack: 15,
        magicAttack: 30,
        defence: 10,
        magicDefence: 40,
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
            cost: 2,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'YEET! (Barry)',
                    target: TargetScope.target,
                    scalingStat: BaseStatNames.magicAttack,
                    damageType: DamageType.MAGIC,
                    power: 1.5,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
        {
            name: 'Body Slam',
            cost: 4,
            type: AbilityType.magic,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Body Slam (Barry)',
                    target: TargetScope.target_and_adjacent,
                    scalingStat: BaseStatNames.magicAttack,
                    damageType: DamageType.MAGIC,
                    power: 0.75,
                    duration: 0,
                },
            ],
            statusEffects: [],
        },
    ],
};

export const examplePlayerFormation: Formation = {
    id: crypto.randomUUID(),
    team: FormationTeam.PLAYER,
    combatants: [
        new Combatant(crypto.randomUUID(), examplePlayer, { x: 1, y: 1 }),
        new Combatant(crypto.randomUUID(), examplePlayer2, { x: 2, y: 1 }),
        new Combatant(crypto.randomUUID(), examplePlayer3, { x: 3, y: 1 }),
    ],
    gridDimensions: { x: 3, y: 1 },
};

const plusShapeEscort: RoomTemplate = {
    floorCountRequirement: 1,
    slots: [
        {
            position: { x: 2, y: 1 },
            threatWeight: 0.15,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 2 },
            threatWeight: 0.15,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 2 },
            threatWeight: 0.4,
            acceptableRoles: [CharacterRole.ADC, CharacterRole.BRUISER],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 0.15,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 3 },
            threatWeight: 0.15,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const xShapeBalanced: RoomTemplate = {
    floorCountRequirement: 1,
    slots: [
        {
            position: { x: 1, y: 1 },
            threatWeight: 0.2,
            acceptableRoles: [CharacterRole.HEXER, CharacterRole.SUPPORT, CharacterRole.HEALER],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 1 },
            threatWeight: 0.2,
            acceptableRoles: [CharacterRole.HEXER, CharacterRole.SUPPORT, CharacterRole.HEALER],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 2 },
            threatWeight: 0.2,
            acceptableRoles: [CharacterRole.BRUISER],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 3 },
            threatWeight: 0.2,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 3 },
            threatWeight: 0.2,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const rowShape: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 1, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.DOT, CharacterRole.AREA_MAGE],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.BRUISER],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.DOT, CharacterRole.AREA_MAGE],
            acceptableTags: [],
        },
    ],
};
const rowShapePhalanx: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 1, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const frontlineBacklineShape: RoomTemplate = {
    floorCountRequirement: 2,
    slots: [
        {
            position: { x: 1, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TARGET_MAGE],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TARGET_MAGE],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TARGET_MAGE],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 3 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 2, y: 3 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 3 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const triforceMage: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 2, y: 1 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.TARGET_MAGE, CharacterRole.DOT],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 2 },
            threatWeight: 0.25,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 0.25,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const triforceADC: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 2, y: 1 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.ADC],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 2 },
            threatWeight: 0.25,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 0.25,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const splitDuo: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 1, y: 2 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.BRUISER],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.BRUISER],
            acceptableTags: [],
        },
    ],
};
const splitDuoHexer: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 1, y: 2 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.HEXER],
            acceptableTags: [],
        },
        {
            position: { x: 3, y: 2 },
            threatWeight: 0.5,
            acceptableRoles: [CharacterRole.BRUISER],
            acceptableTags: [],
        },
    ],
};
const solo: RoomTemplate = {
    floorCountRequirement: 0,
    slots: [
        {
            position: { x: 2, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.BRUISER, CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
const dameDelilah: RoomTemplate = {
    floorCountRequirement: 4,
    slots: [
        {
            position: { x: 2, y: 2 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.BOSS],
            acceptableTags: ['dame_delilah'],
        },
        {
            position: { x: 3, y: 3 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
        {
            position: { x: 1, y: 3 },
            threatWeight: 1,
            acceptableRoles: [CharacterRole.TANK],
            acceptableTags: [],
        },
    ],
};
export const roomTemplates: RoomTemplate[] = [
    plusShapeEscort,
    xShapeBalanced,
    rowShape,
    rowShapePhalanx,
    frontlineBacklineShape,
    triforceMage,
    triforceADC,
    splitDuo,
    splitDuoHexer,
    solo,
    dameDelilah,
];
