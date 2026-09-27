import './monster-item.css';
import { isTargetValid } from '../../domain/character/isTargetValid';
import {
    Ability,
    Combatant,
    CombatEvent,
    FormationTeam,
    MonsterCombatant,
} from '../../domain/types';

type Props = {
    combatant: MonsterCombatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onAnimationComplete: (combatantID: string) => void;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterItem = ({ combatant, currentAbility, currentPlayer, onEnemySelect }: Props) => {
    const isTargetable =
        currentAbility &&
        currentPlayer &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.MONSTER,
        );

    return (
        <div
            key={combatant.id}
            onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
            className={'monster-item ' + (isTargetable ? 'monster-item--selecting' : '')}
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
        >
            <b>{combatant.character.name}</b>
            <div>{`HP: ${combatant.character.currentHP}/${combatant.character.stats.healthPoints}`}</div>
            <div>{`Next Action: ${combatant.turnsUntilAction}`}</div>
        </div>
    );
};
