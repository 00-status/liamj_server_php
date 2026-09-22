import './monster-stats.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation, FormationTeam, MonsterCombatant } from '../domain/types';
import { isTargetValid } from '../domain/character/isTargetValid';

type Props = {
    formation: Formation;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterStats = ({
    formation,
    currentAbility,
    currentPlayer,
    onEnemySelect,
}: Props) => {
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
                    const isTargetable =
                        currentAbility &&
                        currentPlayer &&
                        isTargetValid(
                            currentAbility.abilityTarget,
                            currentPlayer.id,
                            combatant,
                            FormationTeam.MONSTER,
                        );
                    return (
                        <div
                            key={combatant.id}
                            onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
                            className={
                                'monster-stats__item ' +
                                (isTargetable ? 'monster-stats__item--selecting' : '')
                            }
                            style={{
                                gridColumnStart: combatant.position.x,
                                gridRowStart: combatant.position.y,
                            }}
                        >
                            <b>{combatant.character.name}</b>
                            <div>{`HP: ${combatant.character.currentHP}/${combatant.character.stats.healthPoints}`}</div>
                            <div>{`Next Action: ${combatant.turnsUntilAction}`}</div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
