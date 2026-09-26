import { changePoints } from '../character/changePoints';
import { decreaseModifierDuration } from '../character/decreaseModifierDuration';
import {
    decreaseTurnsForMonsterCombatantList,
    resetTurnsUntilAction,
} from '../monster/turnsUntilAction';
import { Character, Combatant, CombatEvents, CombatEventType, MonsterCombatant } from '../types';

type CombatantDictionary = { [combatantID: string]: Combatant };

type CombatEventHandlers = Record<
    CombatEventType,
    (event: CombatEvents, combatants: Combatant[]) => CombatantDictionary
>;

export const combatEventHandlers: CombatEventHandlers = {
    [CombatEventType.APPLY_DAMAGE]: (event: CombatEvents, combatants: Combatant[]) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.APPLY_DAMAGE) {
            return combatantDictionary;
        }

        for (const target of event.targets) {
            const targetToUpdate = combatantDictionary[target.targetCombatantID];
            if (!targetToUpdate) {
                continue;
            }

            const newCharacter: Character = changePoints(
                targetToUpdate.character,
                target.amount,
                target.damageType,
            );
            targetToUpdate.character = newCharacter;
        }

        return combatantDictionary;
    },
    [CombatEventType.APPLY_POINT_EFFECT]: (event: CombatEvents, combatants: Combatant[]) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.APPLY_POINT_EFFECT) {
            return combatantDictionary;
        }

        for (const targetID of event.targetCombatantIDs) {
            const targetToUpdate = combatantDictionary[targetID];
            if (!targetToUpdate) {
                continue;
            }

            const newCharacter: Character = {
                ...targetToUpdate.character,
                pointModifiers: [...targetToUpdate.character.pointModifiers, event.pointModifier],
            };
            targetToUpdate.character = newCharacter;
        }

        return combatantDictionary;
    },
    [CombatEventType.APPLY_STATUS_EFFECT]: (event: CombatEvents, combatants: Combatant[]) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.APPLY_STATUS_EFFECT) {
            return combatantDictionary;
        }

        for (const targetID of event.targetCombatantIDs) {
            const targetToUpdate = combatantDictionary[targetID];
            if (!targetToUpdate) {
                continue;
            }

            const newCharacter: Character = {
                ...targetToUpdate.character,
                modifiers: [...targetToUpdate.character.modifiers, event.statModifier],
            };
            targetToUpdate.character = newCharacter;
        }

        return combatantDictionary;
    },
    [CombatEventType.CAST_ABILITY]: (event: CombatEvents, combatants: Combatant[]) => {
        return keyCombatantsByID(combatants);
    },
    [CombatEventType.DECREASE_MODIFIERS]: (event: CombatEvents, combatants: Combatant[]) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.DECREASE_MODIFIERS) {
            return combatantDictionary;
        }

        const targetToUpdate = combatantDictionary[event.combatantID];
        if (!targetToUpdate) {
            return combatantDictionary;
        }

        const { newCharacter } = decreaseModifierDuration(targetToUpdate.character);
        targetToUpdate.character = newCharacter;

        return combatantDictionary;
    },
    [CombatEventType.DECREASE_TURNS_UNTIL_ACTION]: (
        event: CombatEvents,
        combatants: Combatant[],
    ) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.DECREASE_TURNS_UNTIL_ACTION) {
            return combatantDictionary;
        }

        const updatedCombatants = decreaseTurnsForMonsterCombatantList(
            Object.values(combatantDictionary),
        );

        for (const updatedCombatant of updatedCombatants) {
            combatantDictionary[updatedCombatant.id] = updatedCombatant;
        }

        return combatantDictionary;
    },
    [CombatEventType.RESET_TURN_TIMER]: (event: CombatEvents, combatants: Combatant[]) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        if (event.type !== CombatEventType.RESET_TURN_TIMER) {
            return combatantDictionary;
        }

        const targetToUpdate = combatantDictionary[event.combatantID];
        if (!targetToUpdate) {
            return combatantDictionary;
        }

        if (!(targetToUpdate instanceof MonsterCombatant)) {
            return combatantDictionary;
        }

        targetToUpdate.turnsUntilAction = resetTurnsUntilAction();

        return combatantDictionary;
    },
};

const keyCombatantsByID = (combatants: Combatant[]): CombatantDictionary => {
    const combatantsByID: { [key: string]: Combatant } = combatants.reduce<{
        [key: string]: Combatant;
    }>((acc, combatant) => {
        acc[combatant.id] = combatant.clone();
        return acc;
    }, {});

    return combatantsByID;
};
