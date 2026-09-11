import { BaseStatNames, Character } from '../types';

export const getCharacterStat = (character: Character, stat: BaseStatNames) => {
    // Create a list of all modifiers (equipment or otherwise) for the given stat.
    // Create an acc
    // For each modifier
    //      If the modifier is flat
    //          add the modifier to the stat.
    //      else
    //          Multiply the modifier with the stat.
    // Round the acc to an int.
    // Return the acc
};
