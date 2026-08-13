import { render } from '@testing-library/react';
import { Children } from 'react';
import userEvent from '@testing-library/user-event';
import * as GTAG from 'ga-gtag';

import DiceRoller from './DiceRoller';

jest.mock('../../SharedComponents/Page/Page', () => {
    return {
        Page: ({ children }: { children: typeof Children }) => <>{children}</>,
    };
});

describe('DiceRoller.tsx', () => {
    const mockGtag = jest.fn();
    beforeEach(() => {
        jest.spyOn(GTAG, 'gtag').mockImplementation(mockGtag);
    });

    it('should render each component', () => {
        const { getByText, getByTitle } = render(<DiceRoller />);

        getByText('Dice Roller');
        getByText('Result');
        getByText('Log');

        getByTitle('dice 4');
        getByTitle('dice 6');
        getByTitle('dice 8');
        getByTitle('dice 10');
        getByTitle('dice 12');
        getByTitle('dice 20');
    });

    it('should display a result when clicking a button', async () => {
        const { queryByText, getByTitle, getByText } = render(<DiceRoller />);

        expect(queryByText('1d20')).toBeNull();
        await userEvent.click(getByTitle('dice 20'));
        getByText(/1d20=/i);

        expect(mockGtag).toHaveBeenCalledTimes(1);
        expect(mockGtag).toHaveBeenCalledWith('event', 'button_click_die_twenty');
    });
});
