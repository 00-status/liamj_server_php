import { CartSlot } from '../DnDShop';

export const generateEmptyCartSlots = (
    startingIdNumber: number,
    slotsToGenerate: number,
): CartSlot[] => {
    if (slotsToGenerate <= 0) {
        throw new Error('Invalid count!');
    }

    const emptyCartSlots = [];

    for (let count = 0; count < slotsToGenerate; count++) {
        const emptyCartSlot = {
            droppableID: 'droppable|' + (count + startingIdNumber),
            item: null,
        };
        emptyCartSlots.push(emptyCartSlot);
    }

    return emptyCartSlots;
};
