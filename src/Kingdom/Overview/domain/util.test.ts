import { calculateRegionTileCounts } from './util';
import { Tile } from './types';

describe('calculateRegionTileCounts', () => {
    it('should correctly count standard tile types and return 0 for unrepresented ones', () => {
        const mockTiles: Tile[] = [
            { id: 1, region_id: 10, x: 0, y: 0, type: 'Prairie' },
            { id: 2, region_id: 10, x: 1, y: 0, type: 'Prairie' },
            { id: 3, region_id: 10, x: 2, y: 0, type: 'Woodland' },
            { id: 4, region_id: 10, x: 3, y: 0, type: 'Mountain' },
            { id: 5, region_id: 10, x: 4, y: 0, type: 'Water' },
            { id: 6, region_id: 10, x: 5, y: 0, type: 'Water' },
            { id: 7, region_id: 10, x: 6, y: 0, type: 'Water' },
        ];

        const stats = calculateRegionTileCounts(mockTiles);

        expect(stats).toEqual({
            Prairie: 2,
            Woodland: 1,
            Mountain: 1,
            Hills: 0,
            Wetland: 0,
            Water: 3,
        });
    });

    it('should handle custom/unrecognized tile types if present', () => {
        const mockTiles: Tile[] = [
            { id: 1, region_id: 10, x: 0, y: 0, type: 'Prairie' },
            { id: 2, region_id: 10, x: 1, y: 0, type: 'Volcano' },
        ];

        const stats = calculateRegionTileCounts(mockTiles);

        expect(stats).toEqual({
            Prairie: 1,
            Woodland: 0,
            Mountain: 0,
            Hills: 0,
            Wetland: 0,
            Water: 0,
            Volcano: 1,
        });
    });

    it('should return all standard types initialized to 0 when tile array is empty', () => {
        const stats = calculateRegionTileCounts([]);

        expect(stats).toEqual({
            Prairie: 0,
            Woodland: 0,
            Mountain: 0,
            Hills: 0,
            Wetland: 0,
            Water: 0,
        });
    });
});
