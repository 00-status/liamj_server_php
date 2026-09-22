import './player-formation.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation } from '../../domain/types';

import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';
import { PlayerGridButton } from './PlayerGridButton';

type Props = {
    formation: Formation;
    canPlayerTakeActions: boolean;
    currentPlayer: Combatant | null;
    currentAbility: Ability | null;
    onPlayerSelect: (combatantID: string) => void;
    onPlayerAbility: (ability: Ability) => void;
    onTargetCombatant: (target: Combatant) => void;
};

export const PlayerFormation = ({
    formation,
    canPlayerTakeActions,
    currentPlayer,
    currentAbility,
    onPlayerSelect,
    onPlayerAbility,
    onTargetCombatant,
}: Props) => {
    const gridStyles = {
        gridTemplateColumns: '1fr '.repeat(formation.gridDimensions.x),
        gridTemplateRows: '1fr '.repeat(formation.gridDimensions.y),
    };

    return (
        <Card>
            <div>
                <div className="player-formation__grid" style={gridStyles}>
                    {formation.combatants.map((combatant) => {
                        return (
                            <PlayerGridButton
                                key={combatant.id}
                                combatant={combatant}
                                currentAbility={currentAbility}
                                currentPlayer={currentPlayer}
                                onTarget={onTargetCombatant}
                                onSelect={onPlayerSelect}
                            />
                        );
                    })}
                </div>
                <hr className="divider" />
                <h2>{currentPlayer ? currentPlayer.character.name : 'Character'}</h2>
                {currentPlayer && (
                    <div className="player-formation__information">
                        <PlayerActions
                            player={currentPlayer.character}
                            canPlayerTakeActions={canPlayerTakeActions}
                            currentAbility={currentAbility}
                            onPlayerAbility={onPlayerAbility}
                        />
                        <PlayerStats player={currentPlayer.character} />
                    </div>
                )}
            </div>
        </Card>
    );
};
