import { BaseStatNames, DamageScaleMethod, Equipment, EquipmentSlot } from './types';

export const exampleEquippables: Equipment[] = [
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: 'Cape of Daring',
        cost: 250,
        slot: EquipmentSlot.trinket,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.defence,
                value: 0.9,
                type: DamageScaleMethod.PERCENT,
            },
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.attack,
                value: 1.1,
                type: DamageScaleMethod.PERCENT,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: 'Armour of the Valiant Knight',
        cost: 500,
        slot: EquipmentSlot.armour,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.defence,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.magicDefence,
                value: 20,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: 'Hellblade',
        cost: 800,
        slot: EquipmentSlot.weapon,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.attack,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.magicAttack,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: 'Phial of Light',
        cost: 100,
        slot: EquipmentSlot.trinket,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.magicPoints,
                value: 1,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.magicDefence,
                value: 10,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: "Captain's Helm",
        cost: 400,
        slot: EquipmentSlot.trinket,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.defence,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        characterID: null,
        name: 'Armour of the Bulwark',
        cost: 800,
        slot: EquipmentSlot.armour,
        modifiers: [
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.defence,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: crypto.randomUUID(),
                stat: BaseStatNames.healthPoints,
                value: 100,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
];
