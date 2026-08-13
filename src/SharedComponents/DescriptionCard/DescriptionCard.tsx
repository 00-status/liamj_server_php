import { ReactNode } from 'react';

import './description-card.css';

type Props = {
    children: ReactNode;
};

export const DescriptionCard = (props: Props) => {
    return <div className="description-card">{props.children}</div>;
};
