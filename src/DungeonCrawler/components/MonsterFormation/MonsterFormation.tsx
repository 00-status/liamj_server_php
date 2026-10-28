import './monster-formation.css';
import { useMemo } from 'react';

import type { Combatant} from '../../domain/Combatant';
import { MonsterCombatant } from '../../domain/Combatant';
import type { Formation } from '../../domain/formation/types';
import type { Ability, CombatEvent, Position } from '../../domain/types';

import { MonsterItem } from './MonsterItem';

type Props = {
    formation: Formation;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterFormation = ({
    formation,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onEnemySelect,
}: Props) => {
    const monsterCombatants = useMemo(() => {
        return formation.combatants.filter((combatant) => combatant instanceof MonsterCombatant);
    }, [formation]);
    const blankCombatants = useMemo(() => fillMonsterGrid(formation), [formation]);

    const gridStyles = {
        gridTemplateColumns: '1fr '.repeat(formation.gridDimensions.x),
        gridTemplateRows: '1fr '.repeat(formation.gridDimensions.y),
    };

    return (
        <div className="monster-formation" style={gridStyles}>
            {monsterCombatants.map((combatant) => (
                <MonsterItem
                    key={combatant.id}
                    combatant={combatant}
                    currentAbility={currentAbility}
                    currentPlayer={currentPlayer}
                    activeCombatEvent={activeCombatEvent}
                    onEnemySelect={onEnemySelect}
                />
            ))}
            {blankCombatants.map((blankCombatant) => {
                const gridItemStyles = {
                    gridTemplateColumns: '1fr '.repeat(blankCombatant.x),
                    gridTemplateRows: '1fr '.repeat(blankCombatant.y),
                };
                return (
                    <div
                        key={`blank-combatant-${blankCombatant.x}-${blankCombatant.y}`}
                        className="monster-formation__blank-combatant"
                        style={gridItemStyles}
                    />
                );
            })}
        </div>
    );
};

const fillMonsterGrid = (formation: Formation): Position[] => {
    const blankSpaces: Position[] = [];
    for (let x = 1; x <= formation.gridDimensions.x; x++) {
        for (let y = 1; y <= formation.gridDimensions.y; y++) {
            const matchingCombatant = formation.combatants.find(
                (combatant) => combatant.position.x === x && combatant.position.y === y,
            );

            if (matchingCombatant) {
                continue;
            }

            blankSpaces.push({ x, y });
        }
    }

    return blankSpaces;
};
