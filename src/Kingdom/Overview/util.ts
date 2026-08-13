import { Terrain, Tile } from './domain/types';

export function generateWeightedTerrain(
    rowSize: number,
    columnSize: number,
    tilez?: Array<Tile>,
): Terrain {
    const tiles: Array<Tile> = tilez ?? [];

    for (let x = 0; x < rowSize; x++) {
        for (let y = 0; y < columnSize; y++) {
            const neighboringTiles = getNeighboringTiles(x, y, tiles);
            const terrainType = determineTerrain(neighboringTiles);
            tiles.push({ id: crypto.randomUUID(), x, y, type: terrainType, traits: [] });
        }
    }

    return { rowSize, columnSize, tiles };
}

export function getNeighboringTiles(x: number, y: number, tiles: Array<Tile>): Tile[] {
    return tiles.filter(
        (tile) =>
            (tile.x === x && tile.y === y - 1) || // Up
            (tile.x === x + 1 && tile.y === y - 1) || // Up-right
            (tile.x === x + 1 && tile.y === y) || // Right
            (tile.x === x + 1 && tile.y === y + 1) || // Down-right
            (tile.x === x && tile.y === y + 1) || // Down
            (tile.x === x - 1 && tile.y === y + 1) || // Down
            (tile.x === x - 1 && tile.y === y) || // Left
            (tile.x === x - 1 && tile.y === y - 1), // Left-up
    );
}

function determineTerrain(neighboringTiles: Array<Tile>): string {
    const terrainWeights: { [key: string]: number } = {
        Prairie: 1,
        Forest: 1,
        Mountain: 1,
        Swamp: 1,
    };

    neighboringTiles.forEach((neighboringTile) => {
        switch (neighboringTile.type) {
            case 'Prairie':
                terrainWeights[neighboringTile.type] += 2;
                break;
            case 'Mountain':
            case 'Swamp':
                terrainWeights[neighboringTile.type] += 0.5;
                break;
            case 'Forest':
            default:
                terrainWeights[neighboringTile.type] += 2;
                break;
        }
    });

    // Select terrain based on weights
    const totalWeight = Object.values(terrainWeights).reduce((acc, weight) => acc + weight, 0);
    let randomValue = Math.random() * totalWeight;

    for (const [terrain, weight] of Object.entries(terrainWeights)) {
        randomValue -= weight;
        if (randomValue <= 0) {
            return terrain;
        }
    }

    return 'Prairie';
}

export const extractCenterGrid = (originalTerrain: Terrain, newSize: number): Terrain => {
    const centerStart = Math.floor((originalTerrain.rowSize - newSize) / 2);
    const centerEnd = centerStart + newSize - 1;

    const tiles = originalTerrain.tiles.filter(
        (tile) =>
            tile.x >= centerStart &&
            tile.x <= centerEnd &&
            tile.y >= centerStart &&
            tile.y <= centerEnd,
    );

    const reIndexedTiles = tiles.map((tile) => {
        return { ...tile, x: tile.x - centerStart, y: tile.y - centerStart };
    });

    return { rowSize: newSize, columnSize: newSize, tiles: reIndexedTiles };
};
