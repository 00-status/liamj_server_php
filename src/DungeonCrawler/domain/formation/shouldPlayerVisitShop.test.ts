import { isDungeonFloorCompleted } from './shouldPlayerVisitShop';

describe('shouldPlayerVisitShop', () => {
    it('returns false for non-positive room counts', () => {
        expect(isDungeonFloorCompleted(0)).toBe(false);
        expect(isDungeonFloorCompleted(-1)).toBe(false);
    });

    it('visits shop every 3 rooms up to room 9', () => {
        expect(isDungeonFloorCompleted(1)).toBe(false);
        expect(isDungeonFloorCompleted(2)).toBe(false);
        expect(isDungeonFloorCompleted(3)).toBe(true);
        expect(isDungeonFloorCompleted(4)).toBe(false);
        expect(isDungeonFloorCompleted(6)).toBe(true);
        expect(isDungeonFloorCompleted(9)).toBe(true);
    });

    it('visits shop every 4 rooms between room 10 and 20', () => {
        expect(isDungeonFloorCompleted(10)).toBe(false);
        expect(isDungeonFloorCompleted(11)).toBe(false);
        expect(isDungeonFloorCompleted(12)).toBe(true);
        expect(isDungeonFloorCompleted(15)).toBe(false);
        expect(isDungeonFloorCompleted(16)).toBe(true);
        expect(isDungeonFloorCompleted(20)).toBe(true);
    });

    it('visits shop every 5 rooms after room 20', () => {
        expect(isDungeonFloorCompleted(21)).toBe(false);
        expect(isDungeonFloorCompleted(24)).toBe(false);
        expect(isDungeonFloorCompleted(25)).toBe(true);
        expect(isDungeonFloorCompleted(30)).toBe(true);
    });
});
