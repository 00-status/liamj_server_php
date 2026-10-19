import { ReactNode } from 'react';

import './dungeon-button.css';

type Props = {
    onClick: () => void;
    isDisabled?: boolean;
    isSelected?: boolean;
    children: ReactNode;
};

export const DungeonButton = ({ onClick, isDisabled, isSelected, children }: Props) => {
    return (
        <button
            className={`dungeon-button ${isSelected ? 'dungeon-button--selected' : ''}`}
            onClick={onClick}
            disabled={isDisabled}
        >
            {children}
        </button>
    );
};
