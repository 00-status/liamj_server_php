import './tile.css';

type Props = {
    type: string;
    onClick: () => void;
    isActive: boolean;
};

export const Tile = (props: Props) => {
    const { type, onClick, isActive } = props;

    return (
        <div className={calculateClassNames(type, isActive)} onClick={onClick}>
            {''}
        </div>
    );
};

const calculateClassNames = (tileType: string, isActive: boolean): string => {
    const classNames = ['tile', 'tile--' + tileType.toLowerCase()];

    if (isActive) {
        classNames.push('tile--is-active');
    }

    return classNames.join(' ');
};
