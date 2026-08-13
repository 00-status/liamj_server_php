import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Die } from './Die';

describe('Die', () => {
    it('should generate a number when the button is clicked', async () => {
        const testCallback = jest.fn();

        const { getByTitle } = render(<Die diceType={20} callback={testCallback} />);

        await userEvent.click(getByTitle('dice 20'));

        expect(testCallback).toHaveBeenCalledTimes(1);
    });
});
