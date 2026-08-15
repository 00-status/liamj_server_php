import { Tile } from './types';

/**
 * Calculates the total occurrences of each tile type in a region.
 */
export function calculateRegionTileCounts(tiles: Tile[]): Record<string, number> {
    const counts: Record<string, number> = {};

    // Initialize standard tile types to 0 so they always show in the breakdown
    const STANDARD_TYPES = ['Prairie', 'Woodland', 'Mountain', 'Hills', 'Wetland', 'Water'];
    STANDARD_TYPES.forEach((type) => {
        counts[type] = 0;
    });

    tiles.forEach((tile) => {
        counts[tile.type] = (counts[tile.type] || 0) + 1;
    });

    return counts;
}
