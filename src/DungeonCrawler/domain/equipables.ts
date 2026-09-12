import { BaseStatNames, Equipment, EquipmentSlot } from './types';

export const exampleEquipables: Equipment[] = [
    {
        name: 'Cape of Daring',
        slot: EquipmentSlot.trinket,
        active: true,
        modifiers: [
            {
                id: '1',
                stat: BaseStatNames.defence,
                value: 0.9,
                type: 'percent',
            },
            {
                id: '2',
                stat: BaseStatNames.attack,
                value: 1.1,
                type: 'percent',
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
                type: 'flat',
            },
            {
                id: '4',
                stat: BaseStatNames.magicDefence,
                value: 20,
                type: 'flat',
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
                type: 'flat',
            },
            {
                id: '4',
                stat: BaseStatNames.magicAttack,
                value: 25,
                type: 'flat',
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
                type: 'flat',
            },
            {
                id: '6',
                stat: BaseStatNames.magicDefence,
                value: 10,
                type: 'flat',
            },
        ],
    },
];
