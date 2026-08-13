export const rollDie = (diceType: number): number => {
    if (diceType <= 0) {
        throw new TypeError('Dice Type cannot be less than 1!');
    }

    const min = Math.ceil(1);
    const max = Math.floor(diceType);

    return Math.floor(Math.random() * (max - min + 1)) + min;
};
