import './player-grid-button.css';
import { isTargetValid } from '../../domain/character/isTargetValid';
import { Ability, Combatant, FormationTeam } from '../../domain/types';

interface CombatantGridButtonProps {
    combatant: Combatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    onTarget: (combatant: Combatant) => void;
    onSelect: (id: string) => void;
}

const BASE_CLASS = 'player-grid-button';

export const PlayerGridButton = ({
    combatant,
    currentAbility,
    currentPlayer,
    onTarget,
    onSelect,
}: CombatantGridButtonProps) => {
    const isTargetable =
        currentAbility &&
        currentPlayer &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.PLAYER,
        );

    const isSelectable = !currentAbility;

    let modifier = '';
    let handleClick: (() => void) | undefined;
    if (isTargetable) {
        modifier = '--targetable';
        handleClick = () => onTarget(combatant);
    } else if (isSelectable) {
        modifier = '--selectable';
        handleClick = () => onSelect(combatant.id);
    }

    return (
        <div
            className={`${BASE_CLASS} ${BASE_CLASS}${modifier}`}
            onClick={handleClick}
            role="button"
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
        >
            <b>{combatant.character.name}</b>
            <p>
                HP: {combatant.character.currentHP}/{combatant.character.stats.healthPoints}
            </p>
        </div>
    );
};
