import { Character, CharacterTier } from '../types';
import { getRandomInt } from '../utiils';

export const calculateValueOfCharacters = (characters: Character[]) => {
    return characters
        .map((character) => {
            return getCharacterWealth(character.tier);
        })
        .reduce((acc, wealth) => {
            return acc + wealth;
        }, 0);
};

const getCharacterWealth = (characterTier: CharacterTier): number => {
    switch (characterTier) {
        default:
        case CharacterTier.ONE:
            return getRandomInt(10, 20);
        case CharacterTier.TWO:
            return getRandomInt(50, 100);
        case CharacterTier.THREE:
            return getRandomInt(150, 500);
        case CharacterTier.FOUR:
            return getRandomInt(1000, 2000);
    }
};
