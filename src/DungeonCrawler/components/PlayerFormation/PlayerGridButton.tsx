import './player-grid-button.css';

import { isTargetValid } from '../../domain/character/isTargetValid';
import {
    Ability,
    Combatant,
    CombatEvent,
    CombatEventType,
    FormationTeam,
} from '../../domain/types';
import {
    getAnimationData,
    getEventAnimationTargetIDs,
} from '../../domain/combatEvents/getAnimationData';

interface Props {
    combatant: Combatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onTarget: (combatant: Combatant) => void;
    onSelect: (id: string) => void;
}

const BASE_CLASS = 'player-grid-button';

export const PlayerGridButton = ({
    combatant,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onTarget,
    onSelect,
}: Props) => {
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

    const shouldPlayAnimation = activeCombatEvent
        ? getEventAnimationTargetIDs(activeCombatEvent).includes(combatant.id)
        : false;
    const combatAnimation = activeCombatEvent
        ? getAnimationData(activeCombatEvent, combatant.id)
        : null;

    let modifier = '';
    let handleClick: (() => void) | undefined;
    if (isTargetable) {
        modifier = '--targetable';
        handleClick = () => onTarget(combatant);
    } else if (isSelectable) {
        modifier = '--selectable';
        handleClick = () => onSelect(combatant.id);
    }

    const shouldAnimateContainer =
        shouldPlayAnimation && combatAnimation && combatAnimation.container === 'container';

    const animationClassName = shouldAnimateContainer ? combatAnimation.name : '';

    return (
        <div
            className={`${BASE_CLASS} ${BASE_CLASS}${modifier} ${animationClassName}`}
            onClick={handleClick}
            role="button"
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
            data-formation={'PLAYER'}
        >
            {shouldPlayAnimation && combatAnimation && combatAnimation.container === 'child' && (
                <div className={combatAnimation.name} data-theme={getDamageType(activeCombatEvent)}>
                    {combatAnimation.text}
                </div>
            )}
            <b>{combatant.character.name}</b>
            <p>
                HP: {combatant.character.currentHP}/{combatant.character.stats.healthPoints}
            </p>
        </div>
    );
};

const getDamageType = (combatEvent?: CombatEvent): string => {
    if (!combatEvent || combatEvent.type !== CombatEventType.APPLY_DAMAGE) {
        return 'PURPLE';
    }

    return combatEvent.damageType;
};
