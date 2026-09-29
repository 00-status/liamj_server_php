import './monster-item.css';

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

    const shouldPlayAnimation = activeCombatEvent?.targetCombatantIDs.includes(combatant.id);
    const combatAnimation = activeCombatEvent
        ? getAnimationData(activeCombatEvent, combatant.id)
        : null;

    const shouldAnimateContainer =
        shouldPlayAnimation && combatAnimation && combatAnimation.container === 'container';

    const animationClassName = shouldAnimateContainer ? combatAnimation.name : '';

    return (
        <>
            <div
                onClick={() => (isTargetable ? onEnemySelect(combatant) : null)}
                className={`monster-item ${isTargetable ? 'monster-item--selecting' : ''} ${animationClassName} `}
                style={{
                    gridColumnStart: combatant.position.x,
                    gridRowStart: combatant.position.y,
                }}
                data-formation={'MONSTER'}
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
