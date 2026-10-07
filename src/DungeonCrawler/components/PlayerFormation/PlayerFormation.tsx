import './player-formation.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, CombatEvent, Equipment, Formation } from '../../domain/types';

import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';
import { PlayerGridButton } from './PlayerGridButton';
import { PlayerEquipment } from './PlayerEquipment';

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
    onEquipmentSelect: (equipment: Equipment, combatantID: string) => void;
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
    onEquipmentSelect,
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
                    <div className="player-formation__information">
                        <PlayerActions
                            player={currentPlayer.character}
                            canPlayerTakeActions={canPlayerTakeActions}
                            currentAbility={currentAbility}
                            onPlayerAbility={onPlayerAbility}
                        />
                        <div>
                            <PlayerStats player={currentPlayer.character} />
                            <PlayerEquipment
                                purchasedEquipment={purchasedEquipment}
                                combatant={currentPlayer}
                                onSelectEquipment={onEquipmentSelect}
                            />
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};
