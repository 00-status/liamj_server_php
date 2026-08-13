import { ReactElement } from 'react';

import './skill-card.css';
export enum SkillLevel {
    'working',
    'expert',
}

type Props = {
    name: string;
    type: string;
    skillLevel: SkillLevel;
};

export const SkillCard = (props: Props): ReactElement => {
    const cardTheme = getCardTheme(props.type);

    return (
        <div className="skill-card">
            <div data-theme={cardTheme} className="skill-card__gradient">
                <div className="skill-card__title">{props.name}</div>
            </div>
            <div className="skill-card__container">
                <div>{props.type}</div>
            </div>
        </div>
    );
};

const getCardTheme = (type: string) => {
    switch (type) {
        case 'Front-end':
            return 'red-card';
        case 'Back-end':
            return 'blue-card';
        case 'Database':
            return 'green-card';
        default:
            return 'default-card';
    }
};
