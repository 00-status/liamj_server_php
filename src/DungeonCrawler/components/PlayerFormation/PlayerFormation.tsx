import { Card } from '../../../SharedComponents/Card/Card';
import { Ability, Combatant, Formation } from '../../domain/types';

import './player-formation.css';
import { PlayerStats } from './PlayerStats';
import { PlayerActions } from './PlayerActions';

type Props = {
    formation: Formation;
    canPlayerAct: boolean;
    currentPlayer: Combatant | null;
    currentAbility: Ability | null;
    onPlayerSelect: (combatantID: string) => void;
    onPlayerAbility: (ability: Ability) => void;
};

export const PlayerFormation = ({
    formation,
    canPlayerAct,
    currentPlayer,
    currentAbility,
    onPlayerSelect,
    onPlayerAbility,
}: Props) => {
    return (
        <Card>
            <div>
                <div>
                    {formation.combatants.map((combatant) => {
                        return (
                            <div key={combatant.id} onClick={() => onPlayerSelect(combatant.id)}>
                                {combatant.character.name}
                            </div>
                        );
                    })}
                </div>
                <h2>Character</h2>
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
