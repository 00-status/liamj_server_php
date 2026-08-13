import './story-card.css';

import { StoryBookButton } from './StoryBookButton';

type Props = {
    label: string;
    description: string;
    onStorySelect: () => void;
};

export const StoryCard = ({ label, description, onStorySelect }: Props) => {
    return (
        <div className="story-card">
            <h3>{label}</h3>
            <div className="story-card__contents">
                <div>{description}</div>
                <StoryBookButton onClick={onStorySelect}>Venture Forth!</StoryBookButton>
            </div>
        </div>
    );
};
