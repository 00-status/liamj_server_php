import { Rarity } from './constants';
import { getRarities } from './domain';

describe('domain', () => {
    describe('getRarities', () => {
        it.each([
            [
                {
                    rarity: Rarity.Uncommon,
                    expectedResult: [
                        Rarity.Uncommon,
                        Rarity.Uncommon,
                        Rarity.Uncommon,
                        Rarity.Uncommon,
                        Rarity.Rare,
                    ],
                },
            ],
            [
                {
                    rarity: Rarity.Rare,
                    expectedResult: [
                        Rarity.Uncommon,
                        Rarity.Uncommon,
                        Rarity.Rare,
                        Rarity.Rare,
                        Rarity.VeryRare,
                    ],
                },
            ],
            [
                {
                    rarity: Rarity.VeryRare,
                    expectedResult: [
                        Rarity.Uncommon,
                        Rarity.Rare,
                        Rarity.Rare,
                        Rarity.VeryRare,
                        Rarity.VeryRare,
                    ],
                },
            ],
            [
                {
                    rarity: Rarity.Legendary,
                    expectedResult: [
                        Rarity.Rare,
                        Rarity.Rare,
                        Rarity.VeryRare,
                        Rarity.VeryRare,
                        Rarity.Legendary,
                    ],
                },
            ],
        ])('Should return the appropriate result set', ({ rarity, expectedResult }) => {
            const result = getRarities(rarity);

            expect(result).toEqual(expectedResult);
        });
    });
});
