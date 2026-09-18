import './monster-stats.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Combatant, Formation } from '../domain/types';

import { CharacterStat } from './CharacterStat';

type Props = {
    formation: Formation;
    isPlayerSelecting: boolean;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterStats = ({ formation, isPlayerSelecting, onEnemySelect }: Props) => {
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
                            onClick={() => onEnemySelect(combatant)}
                            className={isPlayerSelecting ? 'monster-stat__item--selecting' : ''}
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
