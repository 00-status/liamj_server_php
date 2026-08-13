import './story-book-button.css';

type Props = {
    children: string;
    onClick: () => void;
};

export const StoryBookButton = ({ children, onClick }: Props) => {
    return (
        <button className="story-book-button" onClick={onClick}>
            {children}
        </button>
    );
};
