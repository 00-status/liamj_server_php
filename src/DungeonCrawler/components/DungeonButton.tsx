import type { ReactNode } from 'react';

import './dungeon-button.css';

export enum DungeonButtonTheme {
    DEFAULT = 'DEFAULT',
    ACTIVE = 'ACTIVE',
    MAGIC = 'MAGIC',
    PHYSICAL = 'PHYSICAL',
}

type Props = {
    onClick: () => void;
    isDisabled?: boolean;
    buttonTheme?: DungeonButtonTheme;
    children: ReactNode;
};

export const DungeonButton = ({ onClick, isDisabled, buttonTheme, children }: Props) => {
    return (
        <button
            type="button"
            data-theme={buttonTheme || DungeonButtonTheme.DEFAULT}
            className="dungeon-button"
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};
