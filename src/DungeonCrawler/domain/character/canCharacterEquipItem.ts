import { Equipment } from '../types';

export const canCharacterEquipItem = (
    characterEquippables: Equipment[],
    targetEquipment: Equipment,
) => {
    const equipmentInSlot = characterEquippables.filter((equipment) => {
        const isInSameSlot = equipment.slot === targetEquipment.slot;
        return isInSameSlot && equipment.active;
    });

    return equipmentInSlot.length < 1;
};
