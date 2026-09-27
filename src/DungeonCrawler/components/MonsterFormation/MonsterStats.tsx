import './monster-stats.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, CombatEvent, Formation, MonsterCombatant } from '../../domain/types';

import { MonsterItem } from './MonsterItem';

type Props = {
    formation: Formation;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onAnimationComplete: (combatantID: string) => void;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterStats = ({
    formation,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onAnimationComplete,
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
                {monsters.map((combatant) => (
                    <MonsterItem
                        key={combatant.id}
                        combatant={combatant}
                        currentAbility={currentAbility}
                        currentPlayer={currentPlayer}
                        activeCombatEvent={activeCombatEvent}
                        onAnimationComplete={onAnimationComplete}
                        onEnemySelect={onEnemySelect}
                    />
                ))}
            </div>
        </Card>
    );
};
