import { ReactNode } from 'react';

import './card.css';

type Props = {
    title: string;
    button?: ReactNode;
    children: ReactNode;
};

export const Card = (props: Props) => {
    return (
        <div className="card">
            <div className="card__title">
                <h2>{props.title}</h2>
                {props.button}
            </div>
            {props.children}
        </div>
    );
};
