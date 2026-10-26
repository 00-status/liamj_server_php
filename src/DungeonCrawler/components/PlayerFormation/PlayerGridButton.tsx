import './player-grid-button.css';

import { isTargetValid } from '../../domain/character/isTargetValid';
import { Combatant } from '../../domain/Combatant';
import { FormationTeam } from '../../domain/formation/types';
import {
    Ability,
    BaseStatNames,
    CombatEvent,
    CombatEventType,
    Equipment,
} from '../../domain/types';
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
    const isTargetable =
        currentAbility &&
        currentPlayer &&
        isCombatantDefeated &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.PLAYER,
        );
    const isSelectable = !currentAbility && !isCombatantDefeated;
    const isSelected = currentPlayer && currentPlayer.id === combatant.id && !isCombatantDefeated;

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
    } else if (isCombatantDefeated) {
        modifier = '--disabled';
    }

    const shouldAnimateContainer =
        shouldPlayAnimation && combatAnimation && combatAnimation.container === 'container';

    const animationClassName = shouldAnimateContainer ? combatAnimation.name : '';
    const selectedClassName = isSelected ? 'player-grid-button--active' : '';

    return (
        <div
            className={`${BASE_CLASS} ${BASE_CLASS}${modifier} ${animationClassName} ${selectedClassName}`}
            onClick={handleClick}
            role="button"
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
            data-formation={'PLAYER'}
        >
            {shouldPlayAnimation && combatAnimation && combatAnimation.container === 'child' && (
                <DamageNumberOverlay
                    key={combatAnimation.id}
                    text={combatAnimation.text}
                    damageTypeTheme={getDamageType(activeCombatEvent)}
                />
            )}
            <div className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : ''}`}>
                {combatant.character.name}
            </div>
            <div
                className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : `${BASE_CLASS}__stat--health-points`}`}
            >
                {combatant.character.currentHP}/
                {getCharacterStat(combatant.character, characterItems, BaseStatNames.healthPoints)}
            </div>
            <div
                className={`${isCombatantDefeated ? `${BASE_CLASS}__stat--disabled` : `${BASE_CLASS}__stat--magic-points`}`}
            >
                {combatant.character.currentMP}/
                {getCharacterStat(combatant.character, characterItems, BaseStatNames.magicPoints)}
            </div>
        </div>
    );
};

const getDamageType = (combatEvent?: CombatEvent): string => {
    if (!combatEvent || combatEvent.type !== CombatEventType.APPLY_DAMAGE) {
        return 'DEFAULT';
    }

    return combatEvent.damageType;
};
