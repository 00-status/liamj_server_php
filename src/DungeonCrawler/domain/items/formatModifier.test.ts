import { BaseStatNames, DamageScaleMethod } from '../types';

import { formatModifier } from './formatModifier';

describe('formatModifier', () => {
    it('formats flat positive modifiers with plus sign and display name', () => {
        expect(
            formatModifier({
                id: '1',
                stat: BaseStatNames.defence,
                value: 50,
                type: DamageScaleMethod.FLAT,
            }),
        ).toBe('+50 DEF');
    });

    it('formats flat negative modifiers without extra plus sign', () => {
        expect(
            formatModifier({
                id: '2',
                stat: BaseStatNames.attack,
                value: -15,
                type: DamageScaleMethod.FLAT,
            }),
        ).toBe('-15 ATK');
    });

    it('formats percent increase modifiers correctly', () => {
        expect(
            formatModifier({
                id: '3',
                stat: BaseStatNames.magicAttack,
                value: 1.15,
                type: DamageScaleMethod.PERCENT,
            }),
        ).toBe('+15% MATK');
    });

    it('formats percent decrease modifiers correctly', () => {
        expect(
            formatModifier({
                id: '4',
                stat: BaseStatNames.defence,
                value: 0.9,
                type: DamageScaleMethod.PERCENT,
            }),
        ).toBe('-10% DEF');
    });
});
