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

        const buttons = getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);

        fireEvent.click(buttons[0]);
        expect(onPlayerPurchase).toHaveBeenCalledTimes(1);
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

        const buttons = getAllByRole('button');
        buttons.forEach((button) => {
            fireEvent.click(button);
        });
        expect(onPlayerPurchase).toHaveBeenCalledTimes(0);
    });
});
