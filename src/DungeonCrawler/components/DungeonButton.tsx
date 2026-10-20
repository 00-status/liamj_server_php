import { ReactNode } from 'react';

import './dungeon-button.css';

export enum DungeonButtonTheme {
    ACTIVE = 'ACTIVE',
    DEFAULT = 'DEFAULT',
}

type Props = {
    onClick: () => void;
    isDisabled?: boolean;
    isSelected?: boolean;
    buttonTheme?: DungeonButtonTheme;
    children: ReactNode;
};

export const DungeonButton = ({
    onClick,
    isDisabled,
    isSelected,
    buttonTheme,
    children,
}: Props) => {
    return (
        <button
            data-theme={buttonTheme || DungeonButtonTheme.DEFAULT}
            className={`dungeon-button ${isSelected ? 'dungeon-button--selected' : ''}`}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};
