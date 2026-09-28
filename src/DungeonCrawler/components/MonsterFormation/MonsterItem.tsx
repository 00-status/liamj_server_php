import './monster-item.css';

import { useEffect, useState } from 'react';

import { isTargetValid } from '../../domain/character/isTargetValid';
import {
    Ability,
    Combatant,
    CombatEvent,
    CombatEventType,
    FormationTeam,
    MonsterCombatant,
} from '../../domain/types';
import { getAnimationData } from '../../domain/combatEvents/getAnimationData';

type Props = {
    combatant: MonsterCombatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onAnimationComplete: (combatantID: string) => void;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterItem = ({
    combatant,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onAnimationComplete,
    onEnemySelect,
}: Props) => {
    const [completedEventId, setCompletedEventId] = useState<string | null>(null);

    const isTargetable =
        currentAbility &&
        currentPlayer &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.MONSTER,
        );

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

    return (
        <>
            <div
                onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
                className={'monster-item ' + (isTargetable ? 'monster-item--selecting' : '')}
                style={{
                    gridColumnStart: combatant.position.x,
                    gridRowStart: combatant.position.y,
                }}
            >
                {shouldPlayAnimation &&
                    combatAnimation &&
                    combatAnimation.container === 'child' && (
                        <div
                            className={combatAnimation.name}
                            data-theme={getDamageType(activeCombatEvent)}
                        >
                            {combatAnimation.text}
                        </div>
                    )}
                <b>{combatant.character.name}</b>
                <div>{`HP: ${combatant.character.currentHP}/${combatant.character.stats.healthPoints}`}</div>
                <div>{`Next Action: ${combatant.turnsUntilAction}`}</div>
            </div>
        </>
    );
};

const getDamageType = (combatEvent?: CombatEvent): string => {
    if (!combatEvent || combatEvent.type !== CombatEventType.APPLY_DAMAGE) {
        return 'PURPLE';
    }

    return combatEvent.damageType;
};
