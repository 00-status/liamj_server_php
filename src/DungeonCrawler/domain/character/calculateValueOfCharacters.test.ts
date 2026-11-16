import type { MonsterCharacter } from '../types';

import { calculateValueOfCharacters } from './calculateValueOfCharacters';

describe('calculateValueOfCharacters', () => {
    const buildMockCharacter = (threatScore: number): MonsterCharacter => ({
        id: 'test-char',
        name: 'Test Character',
        threatScore,
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
            mind: 10,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [],
    });

    it('returns 0 for empty array', () => {
        expect(calculateValueOfCharacters([])).toBe(0);
    });

    it('returns wealth equal to character threatScore', () => {
        const char = buildMockCharacter(100);
        const wealth = calculateValueOfCharacters([char]);
        expect(wealth).toEqual(100);
    });

    it('sums wealth across multiple characters', () => {
        const char1 = buildMockCharacter(50);
        const char2 = buildMockCharacter(50);
        const totalWealth = calculateValueOfCharacters([char1, char2]);
        expect(totalWealth).toEqual(100);
    });
});
