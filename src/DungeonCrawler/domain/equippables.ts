import { BaseStatNames, DamageScaleMethod, Equipment, EquipmentSlot } from './types';

export const exampleEquippables: Equipment[] = [
    {
        name: 'Cape of Daring',
        slot: EquipmentSlot.trinket,
        active: true,
        modifiers: [
            {
                id: '1',
                stat: BaseStatNames.defence,
                value: 0.9,
                type: DamageScaleMethod.PERCENT,
            },
            {
                id: '2',
                stat: BaseStatNames.attack,
                value: 1.1,
                type: DamageScaleMethod.PERCENT,
            },
        ],
    },
    {
        name: 'Armour of the Valiant Knight',
        slot: EquipmentSlot.armour,
        active: true,
        modifiers: [
            {
                id: '3',
                stat: BaseStatNames.defence,
                value: 50,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: '4',
                stat: BaseStatNames.magicDefence,
                value: 20,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        name: 'Hellblade',
        slot: EquipmentSlot.weapon,
        active: true,
        modifiers: [
            {
                id: '3',
                stat: BaseStatNames.attack,
                value: 25,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: '4',
                stat: BaseStatNames.magicAttack,
                value: 25,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
    {
        name: 'Phial of Light',
        slot: EquipmentSlot.trinket,
        active: false,
        modifiers: [
            {
                id: '5',
                stat: BaseStatNames.magicPoints,
                value: 1,
                type: DamageScaleMethod.FLAT,
            },
            {
                id: '6',
                stat: BaseStatNames.magicDefence,
                value: 10,
                type: DamageScaleMethod.FLAT,
            },
        ],
    },
];
