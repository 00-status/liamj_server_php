import { Character, Combatant, Formation, MonsterCombatant } from '../types';

const MIN_GRID = 1;
const MAX_GRID_WIDTH = 4;
const MAX_GRID_HEIGHT = 2;

export const buildNewMonsterFormation = (potentialMonsters: Character[]): Formation => {
    const gridWidth = getRandomInt(MIN_GRID, MAX_GRID_WIDTH);
    const gridHeight = getRandomInt(MIN_GRID, MAX_GRID_HEIGHT);

    const combatants: Combatant[] = [];
    for (let x = 1; x <= gridWidth; x++) {
        for (let y = 1; y <= gridHeight; y++) {
            const shouldSelectMonster = getRandomInt(1, 2) === 2;
            if (!shouldSelectMonster) {
                continue;
            }

            const selectedMonster = selectNewMonster(potentialMonsters);
            const newCombatant: MonsterCombatant = new MonsterCombatant(
                crypto.randomUUID(),
                selectedMonster,
                { x, y },
                0,
            );
            combatants.push(newCombatant);
        }
    }

    if (combatants.length === 0) {
        const selectedMonster = selectNewMonster(potentialMonsters);
        const newCombatant: MonsterCombatant = new MonsterCombatant(
            crypto.randomUUID(),
            selectedMonster,
            { x: 1, y: 1 },
            0,
        );
        combatants.push(newCombatant);
    }

    return {
        id: crypto.randomUUID(),
        team: 'monster',
        gridDimensions: { x: gridWidth, y: gridHeight },
        combatants,
    };
};

const selectNewMonster = (potentialMonsters: Character[]): Character => {
    const selectedIndex = Math.floor(Math.random() * potentialMonsters.length);
    const selectedMonster = potentialMonsters[selectedIndex];

    if (!selectedMonster) {
        throw new Error('Cannot select new monster!');
    }

    return { ...selectedMonster };
};

const getRandomInt = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
