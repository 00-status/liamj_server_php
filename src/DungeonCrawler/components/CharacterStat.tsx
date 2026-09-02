import './character-stat.css';

type Props = {
    label: string;
    value: string | number;
};

export const CharacterStat = ({ label, value }: Props) => {
    return (
        <div className="character-stat">
            <h3>{label}</h3>
            {value}
        </div>
    );
};
