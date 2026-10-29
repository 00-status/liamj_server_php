import './player-grid-button.css';

import { useMemo } from 'react';

import { isTargetValid } from '../../domain/character/isTargetValid';
import type { Combatant } from '../../domain/Combatant';
import { FormationTeam } from '../../domain/formation/types';
import type { Ability, CombatAnimation, CombatEvent, Equipment } from '../../domain/types';
import { BaseStatNames, CombatEventType } from '../../domain/types';
import {
    getAnimationData,
    getEventAnimationTargetIDs,
} from '../../domain/combatEvents/getAnimationData';
import { DamageNumberOverlay } from '../DamageNumberOverlay';
import { getCharacterStat } from '../../domain/character/getCharacterStat';

interface Props {
    combatant: Combatant;
    purchasedEquipment: Equipment[];
    currentAbility: Ability | null;
    currentPlayer: Combatant | null;
    activeCombatEvent?: CombatEvent;
    onTarget: (combatant: Combatant) => void;
    onSelect: (id: string) => void;
}

const BASE_CLASS = 'player-grid-button';

export const PlayerGridButton = ({
    combatant,
    purchasedEquipment,
    currentAbility,
    currentPlayer,
    activeCombatEvent,
    onTarget,
    onSelect,
}: Props) => {
    const characterItems = purchasedEquipment.filter(
        (equippable) => equippable.characterID === combatant.character.id,
    );

    const isCombatantDefeated = combatant.character.currentHP <= 0;
    const isValidAbilityTarget =
        currentAbility &&
        currentPlayer &&
        !isCombatantDefeated &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.PLAYER,
        );

    const isSelectable = !currentAbility && !isCombatantDefeated;
    const isSelected = currentPlayer && currentPlayer.id === combatant.id && !isCombatantDefeated;

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

    const { modifier, animationClassName, handleClick } = useMemo(() => {
        let modifier = '--disabled';
        let handleClick: (() => void) | undefined;
        if (isValidAbilityTarget) {
            modifier = '--targetable';
            handleClick = () => onTarget(combatant);
        } else if (isSelectable) {
            modifier = '--selectable';
            handleClick = () => onSelect(combatant.id);
        } else if (isSelected) {
            modifier = '--active';
        }

        let animationClassName = '';
        if (combatAnimation && combatAnimation.container === 'container') {
            animationClassName = combatAnimation.name;
        }

        return { modifier, animationClassName, handleClick };
    }, [
        combatant,
        combatAnimation,
        isSelectable,
        isSelected,
        isValidAbilityTarget,
        onTarget,
        onSelect,
    ]);

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
            {combatAnimation && combatAnimation.container === 'child' && (
                <DamageNumberOverlay
                    key={combatAnimation.id}
                    text={combatAnimation.text}
                    damageTypeTheme={getDamageType(activeCombatEvent, combatAnimation)}
                />
            )}
            <div className={`${BASE_CLASS}__contents`}>
                <div className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : ''}`}>
                    {combatant.character.name}
                </div>
                <div
                    className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : `${BASE_CLASS}__stat--health-points`}`}
                >
                    {combatant.character.currentHP}/
                    {getCharacterStat(
                        combatant.character,
                        characterItems,
                        BaseStatNames.healthPoints,
                    )}
                </div>
                <div
                    className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : `${BASE_CLASS}__stat--magic-points`}`}
                >
                    {combatant.character.currentMP}/
                    {getCharacterStat(
                        combatant.character,
                        characterItems,
                        BaseStatNames.magicPoints,
                    )}
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
