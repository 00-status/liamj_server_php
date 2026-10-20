import { Equipment, EquipmentSlot } from '../types';

export const canCharacterEquipItem = (
    purchasedEquippables: Equipment[],
    newEquippableID: string,
    characterID: string,
    previousEquippableID?: string | null,
): boolean => {
    const targetEquippable = purchasedEquippables.find(
        (equippable) => equippable.id === newEquippableID,
    );

    if (!targetEquippable || targetEquippable.characterID) {
        return false;
    }

    const equippablesInSlot = purchasedEquippables.filter((equipment) => {
        return (
            equipment.characterID === characterID &&
            equipment.slot === targetEquippable.slot &&
            equipment.id !== previousEquippableID
        );
    });

    if (targetEquippable.slot === EquipmentSlot.trinket) {
        return equippablesInSlot.length < 2;
    }

    return equippablesInSlot.length < 1;
};
