import { Card } from '../../SharedComponents/Card/Card';
import { Character } from '../domain/types';

import { CharacterStat } from './CharacterStat';

type Props = {
    monster: Character;
};

export const MonsterStats = ({ monster }: Props) => {
    return (
        <Card title={monster.name} isFullWidth>
            <CharacterStat
                label="HP"
                value={`${monster.currentHP}/${monster.stats.healthPoints}`}
            />
        </Card>
    );
};
