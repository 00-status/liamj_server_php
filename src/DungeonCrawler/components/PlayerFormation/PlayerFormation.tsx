import './player-formation.css';
import { Combatant } from '../../domain/Combatant';
import { Formation } from '../../domain/formation/types';
import { Ability, CombatEvent, Equipment } from '../../domain/types';

import { PlayerGridButton } from './PlayerGridButton';

type Props = {
    formation: Formation;
    purchasedEquipment: Equipment[];
    currentPlayer: Combatant | null;
    currentAbility: Ability | null;
    activeCombatEvent?: CombatEvent;
    onPlayerSelect: (combatantID: string) => void;
    onTargetCombatant: (target: Combatant) => void;
};

export const PlayerFormation = ({
    formation,
    purchasedEquipment,
    currentPlayer,
    currentAbility,
    activeCombatEvent,
    onPlayerSelect,
    onTargetCombatant,
}: Props) => {
    const gridStyles = {
        gridTemplateColumns: '1fr '.repeat(formation.gridDimensions.x),
        gridTemplateRows: '1fr '.repeat(formation.gridDimensions.y),
    };

    return (
        <div className="player-formation" style={gridStyles}>
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
    );
};
