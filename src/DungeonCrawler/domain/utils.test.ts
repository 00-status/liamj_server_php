import { getRandomInt, randomizeArray } from './utils';

describe('utils', () => {
    describe('getRandomInt', () => {
        it('returns a number within the specified min and max bounds', () => {
            for (let i = 0; i < 20; i++) {
                const result = getRandomInt(5, 10);
                expect(result).toBeGreaterThanOrEqual(5);
                expect(result).toBeLessThanOrEqual(10);
            }
        });

        it('returns min when min equals max', () => {
            expect(getRandomInt(7, 7)).toBe(7);
        });
    });

    describe('randomizeArray', () => {
        it('does not mutate the original array', () => {
            const original = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            const shuffled = randomizeArray(original);

            expect(original).toEqual(originalCopy);
            expect(shuffled).not.toBe(original);
        });

        it('contains the same elements as the original array', () => {
            const original = ['a', 'b', 'c', 'd', 'e'];
            const shuffled = randomizeArray(original);

            expect(shuffled).toHaveLength(original.length);
            expect(shuffled.sort()).toEqual([...original].sort());
        });

        it('handles empty and single element arrays', () => {
            expect(randomizeArray([])).toEqual([]);
            expect(randomizeArray([42])).toEqual([42]);
        });
    });
});
