import { ReactNode } from 'react';

import './pill.css';

type Props = {
    onClick?: () => void;
    children: ReactNode;
};

export const Pill = (props: Props) => {
    return (
        <div onClick={props.onClick} className="pill">
            {props.children}
        </div>
    );
};
