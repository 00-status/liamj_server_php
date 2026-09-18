import './monster-stats.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Formation } from '../domain/types';

import { CharacterStat } from './CharacterStat';

type Props = {
    formation: Formation;
};

export const MonsterStats = ({ formation }: Props) => {
    const gridStyles = {
        gridTemplateColumns: 'auto '.repeat(formation.gridDimensions.x),
        gridTemplateRows: 'auto '.repeat(formation.gridDimensions.y),
    };

    return (
        <Card title={'Monsters!'} isFullWidth>
            <div className="monster-stats" style={gridStyles}>
                {formation.combatants.map((combatant) => {
                    const character = combatant.character;

                    return (
                        <div
                            key={combatant.id}
                            className="monster-stat__item"
                            style={{
                                gridColumnStart: combatant.position.x,
                                gridRowStart: combatant.position.y,
                            }}
                        >
                            <CharacterStat
                                label="HP"
                                value={`${character.currentHP}/${character.stats.healthPoints}`}
                            />
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
