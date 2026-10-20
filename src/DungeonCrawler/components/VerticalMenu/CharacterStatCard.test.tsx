import { fireEvent, render } from '@testing-library/react';

import { Character, CharacterTier, Equipment, EquipmentSlot } from '../../domain/types';

import { CharacterStatCard } from './CharacterStatCard';

describe('CharacterStatCard', () => {
    const mockCharacter: Character = {
        id: 'char-1',
        name: 'Hero',
        tier: CharacterTier.ONE,
        currentHP: 50,
        currentMP: 20,
        stats: {
            healthPoints: 50,
            magicPoints: 20,
            attack: 10,
            defence: 5,
            magicAttack: 8,
            magicDefence: 4,
            critChance: 5,
        },
        abilities: [],
        modifiers: [],
    };

    const mockPurchasedEquipment: Equipment[] = [
        {
            id: 'weapon-1',
            name: 'Iron Sword',
            cost: 100,
            slot: EquipmentSlot.weapon,
            characterID: null,
            modifiers: [],
        },
        {
            id: 'armour-1',
            name: 'Leather Vest',
            cost: 100,
            slot: EquipmentSlot.armour,
            characterID: null,
            modifiers: [],
        },
        {
            id: 'trinket-1',
            name: 'Silver Ring',
            cost: 100,
            slot: EquipmentSlot.trinket,
            characterID: null,
            modifiers: [],
        },
        {
            id: 'trinket-2',
            name: 'Gold Amulet',
            cost: 100,
            slot: EquipmentSlot.trinket,
            characterID: null,
            modifiers: [],
        },
    ];

    it('renders the character stats and 4 equipment dropdowns with placeholders', () => {
        const onEquipmentSelect = jest.fn();

        const { getByLabelText, getByText } = render(
            <CharacterStatCard
                character={mockCharacter}
                purchasedEquipment={mockPurchasedEquipment}
                onEquipmentSelect={onEquipmentSelect}
            />,
        );

        expect(getByText('Hero')).toBeInTheDocument();

        const weaponSelect = getByLabelText('Weapon') as HTMLSelectElement;
        const armourSelect = getByLabelText('Armour') as HTMLSelectElement;
        const trinket1Select = getByLabelText('Trinket 1') as HTMLSelectElement;
        const trinket2Select = getByLabelText('Trinket 2') as HTMLSelectElement;

        expect(weaponSelect).toBeInTheDocument();
        expect(armourSelect).toBeInTheDocument();
        expect(trinket1Select).toBeInTheDocument();
        expect(trinket2Select).toBeInTheDocument();

        expect(weaponSelect.value).toBe('');
        expect(armourSelect.value).toBe('');
        expect(trinket1Select.value).toBe('');
        expect(trinket2Select.value).toBe('');
    });

    it('triggers onEquipmentSelect when an item is selected from a dropdown', () => {
        const onEquipmentSelect = jest.fn();

        const { getByLabelText } = render(
            <CharacterStatCard
                character={mockCharacter}
                purchasedEquipment={mockPurchasedEquipment}
                onEquipmentSelect={onEquipmentSelect}
            />,
        );

        const weaponSelect = getByLabelText('Weapon');
        fireEvent.change(weaponSelect, { target: { value: 'weapon-1' } });

        expect(onEquipmentSelect).toHaveBeenCalledWith(null, 'weapon-1', 'char-1');
    });

    it('allows equipping two different trinkets', () => {
        const onEquipmentSelect = jest.fn();

        const equipmentWithOneTrinket: Equipment[] = [
            ...mockPurchasedEquipment.map((item) =>
                item.id === 'trinket-1' ? { ...item, characterID: 'char-1' } : item,
            ),
        ];

        const { getByLabelText } = render(
            <CharacterStatCard
                character={mockCharacter}
                purchasedEquipment={equipmentWithOneTrinket}
                onEquipmentSelect={onEquipmentSelect}
            />,
        );

        const trinket1Select = getByLabelText('Trinket 1') as HTMLSelectElement;
        const trinket2Select = getByLabelText('Trinket 2') as HTMLSelectElement;

        expect(trinket1Select.value).toBe('trinket-1');
        expect(trinket2Select.value).toBe('');

        fireEvent.change(trinket2Select, { target: { value: 'trinket-2' } });

        expect(onEquipmentSelect).toHaveBeenCalledWith(null, 'trinket-2', 'char-1');
    });
});
