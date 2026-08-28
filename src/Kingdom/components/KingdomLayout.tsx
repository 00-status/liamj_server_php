import { ReactElement } from 'react';

import './kingdom-layout.css';

type Props = {
    title: string;
    children: ReactElement;
};

export const KingdomLayout = ({ title, children }: Props) => {
    return (
        <div className="kingdom-layout">
            <div className="kingdom-layout__header-container">
                <h1 className="kingdom-layout__header">{title}</h1>
            </div>
            <div className="kingdom-layout__body">{children}</div>
        </div>
    );
};
