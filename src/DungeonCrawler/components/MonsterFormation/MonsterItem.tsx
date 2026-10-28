import './monster-item.css';

import { useMemo } from 'react';

import { isTargetValid } from '../../domain/character/isTargetValid';
import type { Combatant, MonsterCombatant } from '../../domain/Combatant';
import { FormationTeam } from '../../domain/formation/types';
import type { Ability, CombatAnimation, CombatEvent} from '../../domain/types';
import { CombatEventType } from '../../domain/types';
import {
    getAnimationData,
    getEventAnimationTargetIDs,
} from '../../domain/combatEvents/getAnimationData';
import { DamageNumberOverlay } from '../DamageNumberOverlay';

type Props = {
    combatant: MonsterCombatant;
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onEnemySelect: (target: Combatant) => void;
};

export const MonsterItem = ({
    combatant,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onEnemySelect,
}: Props) => {
    const isCombatantDefeated = combatant.character.currentHP <= 0;
    const isTargetable =
        currentAbility &&
        currentPlayer &&
        !isCombatantDefeated &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.MONSTER,
        );

    const combatAnimation = useMemo(() => {
        if (!activeCombatEvent) {
            return null;
        }

        const isTargetingActiveCombatant = getEventAnimationTargetIDs(activeCombatEvent).includes(
            combatant.id,
        );

        if (!isTargetingActiveCombatant) {
            return null;
        }

        return getAnimationData(activeCombatEvent, combatant.id);
    }, [combatant.id, activeCombatEvent]);

    let monsterItemClasses = `monster-item `;
    monsterItemClasses += isTargetable ? 'monster-item--selecting ' : '';
    monsterItemClasses += isCombatantDefeated ? 'monster-item--disabled ' : '';
    monsterItemClasses += combatAnimation?.container === 'container' ? combatAnimation.name : '';

    return (
        <div
            onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
            className={monsterItemClasses}
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
            data-formation={'MONSTER'}
        >
            {combatAnimation && combatAnimation.container === 'child' && (
                <DamageNumberOverlay
                    key={combatAnimation.id}
                    text={combatAnimation.text}
                    damageTypeTheme={getDamageType(activeCombatEvent, combatAnimation)}
                />
            )}
            <div
                className={`monster-item__contents ${isCombatantDefeated ? 'monster-item__attributes--disabled' : ''}`}
            >
                <div className="monster-item__attribute--next-action">
                    {combatant.turnsUntilAction}
                </div>
                <div>{combatant.character.name}</div>
                <div className="monster-item__attributes">
                    <div
                        className={`${isCombatantDefeated ? 'monster-item__attribute--disabled' : 'monster-item__attribute--health-points'}`}
                    >
                        {combatant.character.currentHP}
                    </div>
                    <div
                        className={`${isCombatantDefeated ? 'monster-item__attribute--disabled' : 'monster-item__attribute--magic-points'}`}
                    >
                        {combatant.character.currentMP}
                    </div>
                </div>
            </div>
        </div>
    );
};

const getDamageType = (
    combatEvent: CombatEvent | undefined,
    combatAnimation: CombatAnimation,
): string => {
    if (!combatEvent || combatEvent.type !== CombatEventType.APPLY_DAMAGE) {
        return 'DEFAULT';
    }

    if (combatAnimation.isCritical) {
        return 'CRIT';
    }

    return combatEvent.damageType;
};
