import { rollDie } from './util';

describe('rollDie', () => {
    it('should return a number', () => {
        const result = rollDie(6);

        expect(typeof result).toBe('number');
    });

    it('should throw an error when supplied with zero', () => {
        expect(() => rollDie(0)).toThrow(TypeError);
    });

    it('should throw an error when supplied with a negative number', () => {
        expect(() => rollDie(-1)).toThrow(TypeError);
    });
});
