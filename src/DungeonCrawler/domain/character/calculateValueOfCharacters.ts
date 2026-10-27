import { Character, CharacterTier } from '../types';
import { getRandomInt } from '../utils';

export const calculateValueOfCharacters = (characters: Character[]): number => {
    return characters
        .map((character) => {
            return getCharacterWealth(character.tier);
        })
        .reduce((totalWealth, wealth) => {
            return totalWealth + wealth;
        }, 0);
};

const getCharacterWealth = (characterTier: CharacterTier): number => {
    switch (characterTier) {
        default:
        case CharacterTier.ONE:
            return getRandomInt(20, 40);
        case CharacterTier.TWO:
            return getRandomInt(50, 100);
        case CharacterTier.THREE:
            return getRandomInt(150, 500);
        case CharacterTier.FOUR:
            return getRandomInt(1000, 2000);
    }
};
