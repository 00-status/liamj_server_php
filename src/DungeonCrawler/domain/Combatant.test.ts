import { Combatant } from './Combatant';
import type { Character} from './types';
import { CharacterTier } from './types';

describe('Combatant', () => {
    const buildTestCharacter = (critChance = 0): Character => ({
        id: 'char-1',
        name: 'Hero',
        tier: CharacterTier.ONE,
        currentHP: 100,
        currentMP: 20,
        stats: {
            healthPoints: 100,
            magicPoints: 20,
            attack: 20,
            magicAttack: 10,
            defence: 10,
            magicDefence: 10,
            critChance,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [],
    });

    describe('rollCrit & resetCritBag', () => {
        it('returns false when critChance is 0 or negative', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(0), { x: 1, y: 1 });
            expect(combatant.rollCrit(0)).toBe(false);
            expect(combatant.rollCrit(-10)).toBe(false);
            expect(combatant.critBag).toEqual([]);
        });

        it('returns true when critChance is 100 or greater', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(100), { x: 1, y: 1 });
            expect(combatant.rollCrit(100)).toBe(true);
            expect(combatant.rollCrit(150)).toBe(true);
        });

        it('initializes a bag of 4 marbles for 25% crit chance and guarantees a crit on the 4th roll after 3 misses', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(25), { x: 1, y: 1 });

            // Pick the last marble (false) each time
            const pickLast = () => 0.99;
            const spy = jest.spyOn(Math, 'random').mockImplementation(pickLast);

            expect(combatant.rollCrit(25)).toBe(false);
            expect(combatant.critBag.length).toBe(3);

            expect(combatant.rollCrit(25)).toBe(false);
            expect(combatant.critBag.length).toBe(2);

            expect(combatant.rollCrit(25)).toBe(false);
            expect(combatant.critBag.length).toBe(1);

            // 4th roll has only [true] remaining -> guaranteed crit
            expect(combatant.rollCrit(25)).toBe(true);

            // Resets immediately to full bag
            expect(combatant.critBag.length).toBe(4);

            spy.mockRestore();
        });

        it('resets the bag immediately if a crit is scored on the first roll', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(25), { x: 1, y: 1 });

            // Pick index 0 which is `true`
            const pickFirst = () => 0;
            const spy = jest.spyOn(Math, 'random').mockImplementation(pickFirst);

            expect(combatant.rollCrit(25)).toBe(true);
            // Immediately reset to 4 marbles
            expect(combatant.critBag.length).toBe(4);

            spy.mockRestore();
        });

        it('handles 1-in-2 chance (50% critChance)', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(50), { x: 1, y: 1 });
            const pickLast = () => 0.99;
            const spy = jest.spyOn(Math, 'random').mockImplementation(pickLast);

            expect(combatant.rollCrit(50)).toBe(false);
            expect(combatant.critBag.length).toBe(1);

            // 2nd roll guaranteed crit
            expect(combatant.rollCrit(50)).toBe(true);
            expect(combatant.critBag.length).toBe(2);

            spy.mockRestore();
        });
    });

    describe('clone & cloneWith', () => {
        it('deeply clones the critBag array on clone() so mutations do not leak', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(25), { x: 1, y: 1 }, [
                true,
                false,
            ]);
            const clone = combatant.clone();

            expect(clone.critBag).toEqual([true, false]);
            clone.critBag.pop();

            expect(clone.critBag).toEqual([true]);
            expect(combatant.critBag).toEqual([true, false]);
        });

        it('deeply clones the critBag array on cloneWith()', () => {
            const combatant = new Combatant('c-1', buildTestCharacter(25), { x: 1, y: 1 }, [
                true,
                false,
                false,
            ]);
            const clone = combatant.cloneWith({ position: { x: 2, y: 2 } });

            expect(clone.position).toEqual({ x: 2, y: 2 });
            expect(clone.critBag).toEqual([true, false, false]);

            clone.critBag.pop();
            expect(combatant.critBag).toEqual([true, false, false]);
        });
    });
});
