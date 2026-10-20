import { Equipment, EquipmentSlot } from '../types';

import { canCharacterEquipItem } from './canCharacterEquipItem';

describe('canCharacterEquipItem', () => {
    const unequippedSword: Equipment = {
        id: 'sword-1',
        characterID: null,
        name: 'Iron Sword',
        cost: 100,
        slot: EquipmentSlot.weapon,
        modifiers: [],
    };

    const unequippedShield: Equipment = {
        id: 'shield-1',
        characterID: null,
        name: 'Iron Shield',
        cost: 100,
        slot: EquipmentSlot.armour,
        modifiers: [],
    };

    const equippedSword: Equipment = {
        id: 'sword-equipped',
        characterID: 'char-1',
        name: 'Steel Sword',
        cost: 200,
        slot: EquipmentSlot.weapon,
        modifiers: [],
    };

    const swordEquippedToOther: Equipment = {
        id: 'sword-other',
        characterID: 'char-2',
        name: 'Broadsword',
        cost: 150,
        slot: EquipmentSlot.weapon,
        modifiers: [],
    };

    it('returns false if item does not exist in inventory', () => {
        const canEquip = canCharacterEquipItem([], 'non-existent', 'char-1');
        expect(canEquip).toBe(false);
    });

    it('returns false if item is already equipped to someone', () => {
        const canEquip = canCharacterEquipItem([swordEquippedToOther], swordEquippedToOther.id, 'char-1');
        expect(canEquip).toBe(false);
    });

    it('returns true if item is unequipped and slot is open', () => {
        const canEquip = canCharacterEquipItem([unequippedSword], unequippedSword.id, 'char-1');
        expect(canEquip).toBe(true);
    });

    it('returns false if the slot is already occupied and no previous item is replaced', () => {
        const canEquip = canCharacterEquipItem(
            [equippedSword, unequippedSword],
            unequippedSword.id,
            'char-1',
        );
        expect(canEquip).toBe(false);
    });

    it('returns true if the slot is currently occupied by previousEquippableID being replaced', () => {
        const canEquip = canCharacterEquipItem(
            [equippedSword, unequippedSword],
            unequippedSword.id,
            'char-1',
            equippedSword.id,
        );
        expect(canEquip).toBe(true);
    });

    it('allows equipping in a different open slot even when other slots are occupied', () => {
        const canEquip = canCharacterEquipItem(
            [equippedSword, unequippedShield],
            unequippedShield.id,
            'char-1',
        );
        expect(canEquip).toBe(true);
    });

    it('allows equipping a second trinket when one is already equipped', () => {
        const equippedTrinket1: Equipment = {
            id: 'trinket-1',
            characterID: 'char-1',
            name: 'Ring of Health',
            cost: 50,
            slot: EquipmentSlot.trinket,
            modifiers: [],
        };
        const unequippedTrinket2: Equipment = {
            id: 'trinket-2',
            characterID: null,
            name: 'Amulet of Mana',
            cost: 50,
            slot: EquipmentSlot.trinket,
            modifiers: [],
        };

        const canEquip = canCharacterEquipItem(
            [equippedTrinket1, unequippedTrinket2],
            unequippedTrinket2.id,
            'char-1',
        );
        expect(canEquip).toBe(true);
    });

    it('does not allow equipping a third trinket when two are already equipped', () => {
        const equippedTrinket1: Equipment = {
            id: 'trinket-1',
            characterID: 'char-1',
            name: 'Ring of Health',
            cost: 50,
            slot: EquipmentSlot.trinket,
            modifiers: [],
        };
        const equippedTrinket2: Equipment = {
            id: 'trinket-2',
            characterID: 'char-1',
            name: 'Amulet of Mana',
            cost: 50,
            slot: EquipmentSlot.trinket,
            modifiers: [],
        };
        const unequippedTrinket3: Equipment = {
            id: 'trinket-3',
            characterID: null,
            name: 'Lucky Charm',
            cost: 50,
            slot: EquipmentSlot.trinket,
            modifiers: [],
        };

        const canEquip = canCharacterEquipItem(
            [equippedTrinket1, equippedTrinket2, unequippedTrinket3],
            unequippedTrinket3.id,
            'char-1',
        );
        expect(canEquip).toBe(false);
    });
});
