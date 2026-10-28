import { render, screen } from '@testing-library/react';

import type { PlainLogMessage } from '../../domain/types';

import { CombatLogItem } from './CombatLogItem';

describe('CombatLogItem', () => {
    it('renders a plain log message', () => {
        const log: PlainLogMessage = {
            id: '1',
            message: 'Hero is no longer affected by Poison',
        };

        render(<CombatLogItem log={log} />);
        expect(screen.getByText('Hero is no longer affected by Poison')).toBeInTheDocument();
    });
});
