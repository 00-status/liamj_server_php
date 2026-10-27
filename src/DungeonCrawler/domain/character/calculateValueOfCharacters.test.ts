import { Character, CharacterTier } from '../types';

import { calculateValueOfCharacters } from './calculateValueOfCharacters';

describe('calculateValueOfCharacters', () => {
    const buildMockCharacter = (tier: CharacterTier): Character => ({
        id: 'test-char',
        name: 'Test Character',
        tier,
        currentHP: 100,
        currentMP: 10,
        stats: {
            healthPoints: 100,
            magicPoints: 10,
            attack: 10,
            magicAttack: 10,
            defence: 10,
            magicDefence: 10,
            critChance: 0,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [],
    });

    it('returns 0 for empty array', () => {
        expect(calculateValueOfCharacters([])).toBe(0);
    });

    it('returns wealth within tier 1 range', () => {
        const char = buildMockCharacter(CharacterTier.ONE);
        const wealth = calculateValueOfCharacters([char]);
        expect(wealth).toBeGreaterThanOrEqual(10);
        expect(wealth).toBeLessThanOrEqual(40);
    });

    it('returns wealth within tier 2 range', () => {
        const char = buildMockCharacter(CharacterTier.TWO);
        const wealth = calculateValueOfCharacters([char]);
        expect(wealth).toBeGreaterThanOrEqual(50);
        expect(wealth).toBeLessThanOrEqual(100);
    });

    it('sums wealth across multiple characters', () => {
        const char1 = buildMockCharacter(CharacterTier.ONE);
        const char2 = buildMockCharacter(CharacterTier.TWO);
        const totalWealth = calculateValueOfCharacters([char1, char2]);
        expect(totalWealth).toBeGreaterThanOrEqual(60);
        expect(totalWealth).toBeLessThanOrEqual(140);
    });
});
