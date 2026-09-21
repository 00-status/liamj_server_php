import './player-formation.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation, FormationTeam } from '../../domain/types';
import { canPlayerTargetCombatant } from '../../domain/character/canPlayerTargetCombatant';

import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';

type Props = {
    formation: Formation;
    canPlayerAct: boolean;
    currentPlayer: Combatant | null;
    currentAbility: Ability | null;
    onPlayerSelect: (combatantID: string) => void;
    onPlayerAbility: (ability: Ability) => void;
    onTargetCombatant: (target: Combatant) => void;
};

export const PlayerFormation = ({
    formation,
    canPlayerAct,
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
                        const canTargetCombatant =
                            currentAbility &&
                            currentPlayer &&
                            canPlayerTargetCombatant(
                                currentAbility.abilityTarget,
                                currentPlayer?.id,
                                combatant.id,
                                FormationTeam.PLAYER,
                            );

                        const classes =
                            'player-formation__grid-item ' +
                            (canTargetCombatant ? 'player-formation__grid-item--selected' : '');
                        return (
                            <div
                                key={combatant.id}
                                className={classes}
                                onClick={() =>
                                    canTargetCombatant
                                        ? onTargetCombatant(combatant)
                                        : onPlayerSelect(combatant.id)
                                }
                                style={{
                                    gridColumnStart: combatant.position.x,
                                    gridRowStart: combatant.position.y,
                                }}
                            >
                                <b>{combatant.character.name}</b>
                                <p>
                                    HP: {combatant.character.currentHP}/
                                    {combatant.character.stats.healthPoints}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <hr className="divider" />
                <h2>{currentPlayer ? currentPlayer.character.name : 'Character'}</h2>
                {currentPlayer && (
                    <div className="player-formation__information">
                        <PlayerActions
                            player={currentPlayer.character}
                            canPlayerAct={canPlayerAct}
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
