import { Equipment } from '../types';

export const canCharacterEquipItem = (
    purchasedEquipables: Equipment[],
    newEquippableID: string,
    characterID: string,
): boolean => {
    const targetEquippable = purchasedEquipables.find(
        (equippable) => equippable.id === newEquippableID,
    );

    if (!targetEquippable || targetEquippable.characterID) {
        return false;
    }

    const equippablesInSlot = purchasedEquipables.filter((equipment) => {
        return equipment.characterID === characterID && equipment.slot === targetEquippable.slot;
    });
    return equippablesInSlot.length < 1;
};
