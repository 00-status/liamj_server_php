import type { Formation } from '../formation/types';
import type { Character, Position } from '../types';

const GRID_WIDTH_HEIGHT = 3;

export const buildMonsterFormation = (
    clearedFloorCount: number,
    potentialMonsters: Character,
): Formation => {
    // Arguments: clearedFloorCount, potentialMonsters
    // Calculate the encounterBudget and pick an encounterTemplate based on the clearedFloorCount.
    // Divide the encounterBudget by the number of monsters in the encountre to get the average threatScore of each monster.
    //
    // Sort all potentialMonsters by threatScore (largest to smallest).
    // For each position in the encounter
    //      For each Monster
    //          If the Monster's threatScore is equal to or less than the averageThreatScore OR this is the only remaining monster in the list.
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

interface RoomTemplate {
    floorCountRequirement: number;
    combatantTemplates: Array<Position>;
}

const plusShape: RoomTemplate = {
    floorCountRequirement: 1,
    combatantTemplates: [
        { x: 2, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 2, y: 3 },
    ],
};
const xShape: RoomTemplate = {
    floorCountRequirement: 1,
    combatantTemplates: [
        { x: 1, y: 1 },
        { x: 3, y: 1 },
        { x: 2, y: 2 },
        { x: 1, y: 3 },
        { x: 3, y: 3 },
    ],
};
const rowShape: RoomTemplate = {
    floorCountRequirement: 0,
    combatantTemplates: [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
    ],
};
const frontlineBacklineShape: RoomTemplate = {
    floorCountRequirement: 2,
    combatantTemplates: [
        { x: 1, y: 2 },
        { x: 2, y: 2 },
        { x: 3, y: 2 },
        { x: 1, y: 3 },
        { x: 2, y: 3 },
        { x: 3, y: 3 },
    ],
};
const triforce: RoomTemplate = {
    floorCountRequirement: 0,
    combatantTemplates: [
        { x: 1, y: 2 },
        { x: 1, y: 2 },
        { x: 3, y: 2 },
    ],
};
const splitDuo: RoomTemplate = {
    floorCountRequirement: 0,
    combatantTemplates: [
        { x: 1, y: 2 },
        { x: 3, y: 2 },
    ],
};
const solo: RoomTemplate = {
    floorCountRequirement: 0,
    combatantTemplates: [{ x: 2, y: 2 }],
};
