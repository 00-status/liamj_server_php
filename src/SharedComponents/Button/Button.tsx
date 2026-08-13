import { ReactNode } from 'react';

import './button.css';

type Props = {
    buttonTheme?: ButtonTheme;
    hasSheen?: boolean;
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

export enum ButtonTheme {
    Default = 'default-button',
    Delete = 'delete-button',
    Subtle = 'subtle-button',
}

export const Button = (props: Props) => {
    const { buttonTheme, hasSheen, children, onClick, disabled } = props;

    const theme = getTheme(disabled, buttonTheme);
    const classes = getClasses(disabled, hasSheen);

    return (
        <button data-theme={theme} className={classes} disabled={disabled} onClick={onClick}>
            {children}
        </button>
    );
};

const getTheme = (disabled?: boolean, theme?: ButtonTheme): string => {
    if (disabled) {
        return 'disabled-button';
    } else {
        return theme ?? ButtonTheme.Default;
    }
};

const getClasses = (disabled?: boolean, hasSheen?: boolean): string => {
    let classes = 'custom-button';

    if (disabled) {
        classes += ' disabled-button';
    }

    if (hasSheen && !disabled) {
        classes += ' button-sheen';
    }

    return classes;
};
