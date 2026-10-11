import { fireEvent, render } from '@testing-library/react';

import { DungeonShop } from './DungeonShop';

describe('DungeonShop', () => {
    it('renders the shop and triggers continue', () => {
        const onPlayerContinue = jest.fn();
        const onPlayerPurchase = jest.fn();

        const { getByText } = render(
            <DungeonShop
                purchasedItems={[]}
                playerWealth={1000}
                onPlayerPurchase={onPlayerPurchase}
                onPlayerContinue={onPlayerContinue}
            />,
        );

        getByText('Shop');
        const continueButton = getByText('Rest and Continue');
        fireEvent.click(continueButton);

        expect(onPlayerContinue).toHaveBeenCalledTimes(1);
    });

    it('enables purchase button when player wealth is greater than or equal to item cost', () => {
        const onPlayerContinue = jest.fn();
        const onPlayerPurchase = jest.fn();

        const { getAllByRole } = render(
            <DungeonShop
                purchasedItems={[]}
                playerWealth={10000}
                onPlayerPurchase={onPlayerPurchase}
                onPlayerContinue={onPlayerContinue}
            />,
        );

        const buttons = getAllByRole('button', { name: 'Purchase' });
        expect(buttons.length).toBeGreaterThan(0);
        expect((buttons[0] as HTMLButtonElement).disabled).toBe(false);

        fireEvent.click(buttons[0]);
        expect(onPlayerPurchase).toHaveBeenCalled();
    });

    it('disables purchase buttons when player cannot afford items', () => {
        const onPlayerContinue = jest.fn();
        const onPlayerPurchase = jest.fn();

        const { getAllByRole } = render(
            <DungeonShop
                purchasedItems={[]}
                playerWealth={0}
                onPlayerPurchase={onPlayerPurchase}
                onPlayerContinue={onPlayerContinue}
            />,
        );

        const buttons = getAllByRole('button', { name: 'Purchase' });
        buttons.forEach((button) => {
            expect((button as HTMLButtonElement).disabled).toBe(true);
        });
    });
});
