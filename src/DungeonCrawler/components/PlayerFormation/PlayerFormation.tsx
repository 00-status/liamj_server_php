import './player-formation.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation, FormationTeam } from '../../domain/types';
import { isTargetValid } from '../../domain/character/isTargetValid';

import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';

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
                        const isCombatantTargetable =
                            currentAbility &&
                            currentPlayer &&
                            isTargetValid(
                                currentAbility.abilityTarget,
                                currentPlayer?.id,
                                combatant,
                                FormationTeam.PLAYER,
                            );
                        const isCombatantSelectable = !currentAbility;

                        let classes = 'player-formation__grid-item ';
                        let combatantOnClick = () => {};
                        if (isCombatantSelectable) {
                            classes += 'player-formation__grid-item--selectable ';
                            combatantOnClick = () => onPlayerSelect(combatant.id);
                        } else if (isCombatantTargetable) {
                            classes += 'player-formation__grid-item--targetable ';
                            combatantOnClick = () => onTargetCombatant(combatant);
                        }

                        return (
                            <div
                                key={combatant.id}
                                className={classes}
                                onClick={combatantOnClick}
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
