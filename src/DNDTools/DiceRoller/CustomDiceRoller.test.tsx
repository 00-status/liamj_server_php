import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CustomDiceRoller } from './CustomDiceRoller';

describe('CustomDiceRoller', () => {
    it('should render the custom dice roller', () => {
        const { getByText, getByDisplayValue } = render(<CustomDiceRoller callback={jest.fn()} />);

        getByDisplayValue('2');
        getByText('d');
        getByDisplayValue(6);
        getByText('Roll');
    });

    it('should render the custom dice roller', async () => {
        const callbackMock = jest.fn();
        const { getByText } = render(<CustomDiceRoller callback={callbackMock} />);

        expect(callbackMock).toHaveBeenCalledTimes(0);

        await userEvent.click(getByText('Roll'));

        expect(callbackMock).toHaveBeenCalledTimes(1);
    });
});
