import { ReactNode } from 'react';

import './card.css';

type Props = {
    title: string;
    button?: ReactNode;
    isFullWidth?: boolean;
    children: ReactNode;
};

export const Card = (props: Props) => {
    const classes = 'card ' + (props.isFullWidth ? 'card--full-width' : '');
    return (
        <div className={classes}>
            <div className="card__title">
                <h2>{props.title}</h2>
                {props.button}
            </div>
            {props.children}
        </div>
    );
};
