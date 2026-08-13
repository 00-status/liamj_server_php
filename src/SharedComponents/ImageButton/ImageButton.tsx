import './image-button.css';

type Props = {
    locationUrl: string;
    imageUrl: string;
};

export const ImageButton = (props: Props) => {
    return (
        <a
            className="image-button"
            href={props.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
        >
            <img className="image-button__image" src={props.imageUrl} />
        </a>
    );
};
