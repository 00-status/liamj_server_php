import './player-formation.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Combatant } from '../../domain/Combatant';
import { Formation } from '../../domain/formation/types';
import { Ability, CombatEvent, Equipment } from '../../domain/types';

import { PlayerActions } from './PlayerActions';
import { PlayerGridButton } from './PlayerGridButton';

type Props = {
    formation: Formation;
    purchasedEquipment: Equipment[];
    canPlayerTakeActions: boolean;
    currentPlayer: Combatant | null;
    currentAbility: Ability | null;
    activeCombatEvent?: CombatEvent;
    onPlayerSelect: (combatantID: string) => void;
    onPlayerAbility: (ability: Ability) => void;
    onTargetCombatant: (target: Combatant) => void;
};

export const PlayerFormation = ({
    formation,
    purchasedEquipment,
    canPlayerTakeActions,
    currentPlayer,
    currentAbility,
    activeCombatEvent,
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
                                purchasedEquipment={purchasedEquipment}
                                currentAbility={currentAbility}
                                currentPlayer={currentPlayer}
                                activeCombatEvent={activeCombatEvent}
                                onTarget={onTargetCombatant}
                                onSelect={onPlayerSelect}
                            />
                        );
                    })}
                </div>
                <hr className="divider" />
                <h2>{currentPlayer ? currentPlayer.character.name : 'Character'}</h2>
                {currentPlayer && (
                    <PlayerActions
                        player={currentPlayer.character}
                        canPlayerTakeActions={canPlayerTakeActions}
                        currentAbility={currentAbility}
                        onPlayerAbility={onPlayerAbility}
                    />
                )}
            </div>
        </Card>
    );
};
