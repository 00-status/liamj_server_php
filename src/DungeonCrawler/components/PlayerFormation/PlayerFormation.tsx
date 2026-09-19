import { useState } from 'react';

import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation } from '../../domain/types';

import './player-formation.css';
import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';

type Props = {
    formation: Formation;
    canPlayerAct: boolean;
    currentAbility: Ability | null;
    onPlayerAbility: (ability: Ability) => void;
};

export const PlayerFormation = ({
    formation,
    canPlayerAct,
    currentAbility,
    onPlayerAbility,
}: Props) => {
    const [currentCombatantID, setCurrentCombatantID] = useState<string | null>(null);
    const currentCombatant = formation.combatants.find(
        (combatant) => combatant.id === currentCombatantID,
    );

    return (
        <Card>
            <div>
                <div>
                    {formation.combatants.map((combatant) => {
                        return (
                            <div
                                key={combatant.id}
                                onClick={() => setCurrentCombatantID(combatant.id)}
                            >
                                {combatant.character.name}
                            </div>
                        );
                    })}
                </div>
                <h2>Character</h2>
                {currentCombatant && (
                    <div className="player-formation__information">
                        <PlayerActions
                            player={currentCombatant.character}
                            canPlayerAct={canPlayerAct}
                            currentAbility={currentAbility}
                            onPlayerAbility={onPlayerAbility}
                        />
                        <PlayerStats player={currentCombatant.character} />
                    </div>
                )}
            </div>
        </Card>
    );
};
