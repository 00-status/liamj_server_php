import { render, screen } from '@testing-library/react';

import { DamageLogMessage, DamageType, PlainLogMessage } from '../../domain/types';

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

    it('renders physical damage log with highlight', () => {
        const log: DamageLogMessage = {
            id: '2',
            template: '%sourceName dealt %damageValue %damageType to %targetName!',
            sourceName: 'Skeleton',
            targetName: 'Jimothy',
            damageValue: 10,
            damageType: DamageType.PHYSICAL,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe('Skeleton dealt 10 Physical Damage to Jimothy!');
        const highlight = container.querySelector('.vertical-character-menu__highlight--physical');
        expect(highlight).not.toBeNull();
        expect(highlight?.textContent).toBe('Physical Damage');
    });

    it('renders magical damage log with highlight', () => {
        const log: DamageLogMessage = {
            id: '3',
            template: '%sourceName dealt %damageValue %damageType to %targetName!',
            sourceName: 'Skeleton',
            targetName: 'Jimothy',
            damageValue: 10,
            damageType: DamageType.MAGIC,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe('Skeleton dealt 10 Magical Damage to Jimothy!');
        const highlight = container.querySelector('.vertical-character-menu__highlight--magic');
        expect(highlight).not.toBeNull();
        expect(highlight?.textContent).toBe('Magical Damage');
    });

    it('renders healing log with highlight for Health Points', () => {
        const log: DamageLogMessage = {
            id: '4',
            template: '%sourceName healed %targetName for %damageValue Health Points!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 10,
            damageType: DamageType.HEALING,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe(
            'Skeleton Priest healed Zombie for 10 Health Points!',
        );
        const highlight = container.querySelector('.vertical-character-menu__highlight--hp');
        expect(highlight).not.toBeNull();
        expect(highlight?.textContent).toBe('Health Points');
    });

    it('renders self-healing log with "themself"', () => {
        const log: DamageLogMessage = {
            id: '5',
            template: '%sourceName healed %targetName for %damageValue Health Points!',
            sourceName: 'Skeleton Priest',
            targetName: 'themself',
            damageValue: 10,
            damageType: DamageType.HEALING,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe(
            'Skeleton Priest healed themself for 10 Health Points!',
        );
    });

    it('renders magic restore log with highlight for Magic Points', () => {
        const log: DamageLogMessage = {
            id: '6',
            template: '%sourceName restored %damageValue Magic Points to %targetName!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 4,
            damageType: DamageType.MAGIC_RESTORE,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe(
            'Skeleton Priest restored 4 Magic Points to Zombie!',
        );
        const highlight = container.querySelector('.vertical-character-menu__highlight--mp');
        expect(highlight).not.toBeNull();
        expect(highlight?.textContent).toBe('Magic Points');
    });

    it('renders magic drain log with highlight for Magic Points', () => {
        const log: DamageLogMessage = {
            id: '7',
            template: '%sourceName drained %damageValue Magic Points to %targetName!',
            sourceName: 'Skeleton Priest',
            targetName: 'Zombie',
            damageValue: 4,
            damageType: DamageType.MAGIC_DRAIN,
        };

        const { container } = render(<CombatLogItem log={log} />);
        expect(container.textContent).toBe(
            'Skeleton Priest drained 4 Magic Points to Zombie!',
        );
        const highlight = container.querySelector('.vertical-character-menu__highlight--mp');
        expect(highlight).not.toBeNull();
        expect(highlight?.textContent).toBe('Magic Points');
    });
});
