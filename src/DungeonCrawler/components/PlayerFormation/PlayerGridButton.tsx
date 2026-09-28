import './player-grid-button.css';
import { useEffect, useState } from 'react';

import { isTargetValid } from '../../domain/character/isTargetValid';
import {
    Ability,
    Combatant,
    CombatEvent,
    CombatEventType,
    FormationTeam,
} from '../../domain/types';
import { getAnimationData } from '../../domain/combatEvents/getAnimationData';

interface Props {
    combatant: Combatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onAnimationComplete: (combatantID: string) => void;
    onTarget: (combatant: Combatant) => void;
    onSelect: (id: string) => void;
}

const BASE_CLASS = 'player-grid-button';

export const PlayerGridButton = ({
    combatant,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onAnimationComplete,
    onTarget,
    onSelect,
}: Props) => {
    const [completedEventId, setCompletedEventId] = useState<string | null>(null);

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

    const shouldPlayAnimation =
        activeCombatEvent?.targetCombatantIDs.includes(combatant.id) &&
        activeCombatEvent?.id !== completedEventId;
    const combatAnimation = activeCombatEvent
        ? getAnimationData(activeCombatEvent, combatant.id)
        : null;

    useEffect(() => {
        if (shouldPlayAnimation && combatAnimation && activeCombatEvent) {
            const timer = setTimeout(() => {
                setCompletedEventId(activeCombatEvent.id);
                onAnimationComplete(combatant.id);
            }, combatAnimation.durationMilliseconds);

            return () => clearTimeout(timer);
        }

        if (shouldPlayAnimation) {
            const timer = setTimeout(() => {
                setCompletedEventId(null);
                onAnimationComplete(combatant.id);
            }, 0);

            return () => clearTimeout(timer);
        }

        return;
    }, [
        shouldPlayAnimation,
        combatAnimation,
        activeCombatEvent,
        combatant.id,
        onAnimationComplete,
    ]);

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
            {shouldPlayAnimation && combatAnimation && combatAnimation.container === 'child' && (
                <div
                    className={`${BASE_CLASS}__${combatAnimation.name}`}
                    data-theme={getDamageType(activeCombatEvent)}
                >
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
