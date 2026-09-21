import './monster-stats.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Combatant, Formation, MonsterCombatant } from '../domain/types';

type Props = {
    formation: Formation;
    canPlayerSelect: boolean;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterStats = ({ formation, canPlayerSelect, onEnemySelect }: Props) => {
    const monsters = formation.combatants.filter(
        (combatant) => combatant instanceof MonsterCombatant,
    );

    const gridStyles = {
        gridTemplateColumns: '1fr '.repeat(formation.gridDimensions.x),
        gridTemplateRows: '1fr '.repeat(formation.gridDimensions.y),
    };

    return (
        <Card title={'Monsters!'} isFullWidth>
            <div className="monster-stats" style={gridStyles}>
                {monsters.map((combatant) => {
                    const character = combatant.character;

                    return (
                        <div
                            key={combatant.id}
                            onClick={() => (canPlayerSelect ? onEnemySelect(combatant) : null)}
                            className={
                                'monster-stats__item ' +
                                (canPlayerSelect ? 'monster-stats__item--selecting' : '')
                            }
                            style={{
                                gridColumnStart: combatant.position.x,
                                gridRowStart: combatant.position.y,
                            }}
                        >
                            <b>{character.name}</b>
                            <div>{`HP: ${character.currentHP}/${character.stats.healthPoints}`}</div>
                            <div>{`Next Action: ${combatant.turnsUntilAction}`}</div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
