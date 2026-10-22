import './monster-item.css';

import { isTargetValid } from '../../domain/character/isTargetValid';
import { Combatant, MonsterCombatant } from '../../domain/Combatant';
import { FormationTeam } from '../../domain/formation/types';
import { Ability, CombatEvent, CombatEventType } from '../../domain/types';
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
    const isTargetable =
        currentAbility &&
        currentPlayer &&
        isTargetValid(
            currentAbility.abilityTarget,
            currentPlayer.id,
            combatant,
            FormationTeam.MONSTER,
        );

    const shouldPlayAnimation = activeCombatEvent
        ? getEventAnimationTargetIDs(activeCombatEvent).includes(combatant.id)
        : false;
    const combatAnimation = activeCombatEvent
        ? getAnimationData(activeCombatEvent, combatant.id)
        : null;

    const shouldAnimateContainer =
        shouldPlayAnimation && combatAnimation && combatAnimation.container === 'container';

    const animationClassName = shouldAnimateContainer ? combatAnimation.name : '';

    return (
        <div
            onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
            className={`monster-item ${isTargetable ? 'monster-item--selecting' : ''} ${animationClassName} `}
            style={{
                gridColumnStart: combatant.position.x,
                gridRowStart: combatant.position.y,
            }}
            data-formation={'MONSTER'}
        >
            {shouldPlayAnimation && combatAnimation && combatAnimation.container === 'child' && (
                <DamageNumberOverlay
                    key={combatAnimation.id}
                    text={combatAnimation.text}
                    damageTypeTheme={getDamageType(activeCombatEvent)}
                />
            )}
            <div className="monster-item__contents">
                <div>{`Next Action: ${combatant.turnsUntilAction}`}</div>
                <b>{combatant.character.name}</b>
                <div className="monster-item__attributes">
                    <div className="monster-item__attribute--health-points">
                        {combatant.character.currentHP}
                    </div>
                    <div className="monster-item__attribute--magic-points">
                        {combatant.character.currentMP}
                    </div>
                </div>
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
