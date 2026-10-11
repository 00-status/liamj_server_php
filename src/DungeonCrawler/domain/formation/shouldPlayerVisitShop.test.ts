import { shouldPlayerVisitShop } from './shouldPlayerVisitShop';

describe('shouldPlayerVisitShop', () => {
    it('returns false for non-positive room counts', () => {
        expect(shouldPlayerVisitShop(0)).toBe(false);
        expect(shouldPlayerVisitShop(-1)).toBe(false);
    });

    it('visits shop every 3 rooms up to room 9', () => {
        expect(shouldPlayerVisitShop(1)).toBe(false);
        expect(shouldPlayerVisitShop(2)).toBe(false);
        expect(shouldPlayerVisitShop(3)).toBe(true);
        expect(shouldPlayerVisitShop(4)).toBe(false);
        expect(shouldPlayerVisitShop(6)).toBe(true);
        expect(shouldPlayerVisitShop(9)).toBe(true);
    });

    it('visits shop every 4 rooms between room 10 and 20', () => {
        expect(shouldPlayerVisitShop(10)).toBe(false);
        expect(shouldPlayerVisitShop(11)).toBe(false);
        expect(shouldPlayerVisitShop(12)).toBe(true);
        expect(shouldPlayerVisitShop(15)).toBe(false);
        expect(shouldPlayerVisitShop(16)).toBe(true);
        expect(shouldPlayerVisitShop(20)).toBe(true);
    });

    it('visits shop every 5 rooms after room 20', () => {
        expect(shouldPlayerVisitShop(21)).toBe(false);
        expect(shouldPlayerVisitShop(24)).toBe(false);
        expect(shouldPlayerVisitShop(25)).toBe(true);
        expect(shouldPlayerVisitShop(30)).toBe(true);
    });
});
