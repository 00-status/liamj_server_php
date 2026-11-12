import type { Formation } from '../formation/types';
import type { Character } from '../types';

export const buildMonsterFormation = (
    clearedFloorCount: number,
    potentialMonsters: Character,
): Formation => {
    // Arguments: clearedFloorCount, potentialMonsters
    // Calculate the encounterBudget based on the clearedFloorCount.
    // Determine how many monsters are in the encounter.
    // Determine where the monsters should be placed in the grid.
    // Get the average threat score of each monster.
    //
    // Sort all potentialMonsters by threatScore (largest to smallest).
    // For each position in the encounter
    //      For each Monster
    //          If the Monster's threatScore is equal to or less than the averageThreatScore
    //              Choose this monster for the current position.
    // Create MonsterCombatants for each Character.
    // Return new Formation object

    throw new Error();
};

const encounterBudget = [
    { floorCountRequirement: 0, encounterBudget: 150 },
    { floorCountRequirement: 1, encounterBudget: 252 },
    { floorCountRequirement: 2, encounterBudget: 504 },
    { floorCountRequirement: 3, encounterBudget: 756 },
    { floorCountRequirement: 4, encounterBudget: 1008 },
    { floorCountRequirement: 5, encounterBudget: 1260 },
    { floorCountRequirement: 6, encounterBudget: 1512 },
    { floorCountRequirement: 7, encounterBudget: 2520 },
];
