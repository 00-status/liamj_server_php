import { Character } from '../domain/types';

type Props = {
    monster: Character;
};

export const MonsterStats = ({ monster }: Props) => {
    return (
        <div>
            <h2>{monster.name}</h2>
            <div>
                {monster.currentHP}/{monster.stats.healthPoints}
            </div>
        </div>
    );
};
