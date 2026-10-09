import { Equipment } from '../types';

export const canCharacterEquipItem = (
    purchasedEquipables: Equipment[],
    newEquippableID: string,
): boolean => {
    const targetEquippable = purchasedEquipables.find(
        (equippable) => equippable.id === newEquippableID,
    );

    if (!targetEquippable || targetEquippable.characterID) {
        return false;
    }

    const unassignedEquippablesInSlot = purchasedEquipables.filter((equipment) => {
        return equipment.slot === targetEquippable.slot;
    });
    return unassignedEquippablesInSlot.length < 1;
};
