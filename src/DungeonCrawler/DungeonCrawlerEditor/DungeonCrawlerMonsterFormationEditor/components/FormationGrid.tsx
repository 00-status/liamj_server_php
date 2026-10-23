import { ReactElement } from 'react';

import { MonsterCombatant } from '../../../domain/Combatant';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';

import './formation-grid.css';

interface FormationGridProps {
    combatants: MonsterCombatant[];
    selectedCombatantId: string | null;
    onSelectCombatant: (id: string) => void;
    onAddCombatantAt: (x: number, y: number) => void;
}

export const FormationGrid = ({
    combatants,
    selectedCombatantId,
    onSelectCombatant,
    onAddCombatantAt,
}: FormationGridProps): ReactElement => {
    // 3 rows (y: 1 to 3), 3 columns (x: 1 to 3)
    const cells = [];
    for (let y = 1; y <= 3; y++) {
        for (let x = 1; x <= 3; x++) {
            const combatant = combatants.find((c) => c.position.x === x && c.position.y === y);
            cells.push({ x, y, combatant });
        }
    }

    return (
        <div className="formation-grid">
            <h3>Formation Grid (3x3)</h3>
            <div className="formation-grid__board">
                {cells.map(({ x, y, combatant }) => {
                    const isSelected = combatant && combatant.id === selectedCombatantId;
                    return (
                        <div
                            key={`cell-${x}-${y}`}
                            className={`formation-grid__cell ${
                                combatant ? 'formation-grid__cell--occupied' : ''
                            } ${isSelected ? 'formation-grid__cell--selected' : ''}`}
                            onClick={() => {
                                if (combatant) {
                                    onSelectCombatant(combatant.id);
                                }
                            }}
                        >
                            {combatant ? (
                                <>
                                    <span className="formation-grid__monster-name">
                                        {combatant.character.name}
                                    </span>
                                    <span className="formation-grid__monster-stats">
                                        HP: {combatant.character.stats.healthPoints} | MP:{' '}
                                        {combatant.character.currentMP}
                                    </span>
                                    <span className="formation-grid__monster-stats">
                                        Pos: ({x}, {y})
                                    </span>
                                </>
                            ) : (
                                <Button
                                    buttonTheme={ButtonTheme.Subtle}
                                    onClick={() => onAddCombatantAt(x, y)}
                                >
                                    + Add ({x}, {y})
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
