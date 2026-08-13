import './anchor.css';

type Props = {
    link: string;
    displayText: string;
};

export const Anchor = (props: Props) => {
    return (
        <a className="anchor" target="_blank" rel="noopener noreferrer" href={props.link}>
            {props.displayText}
        </a>
    );
};
