import { changePoints } from '../character/changePoints';
import { decreaseModifierDuration } from '../character/decreaseModifierDuration';
import {
    decreaseTurnsForMonsterCombatantList,
    resetTurnsUntilAction,
} from '../monster/turnsUntilAction';
import { Character, Combatant, CombatEvent, CombatEventType, MonsterCombatant } from '../types';

type CombatantDictionary = { [combatantID: string]: Combatant };

type CombatEventHandlerMap = {
    [K in CombatEventType]: (
        event: Extract<CombatEvent, { type: K }>,
        combatants: Combatant[],
    ) => CombatantDictionary;
};

export const combatEventHandlers: CombatEventHandlerMap = {
    [CombatEventType.APPLY_DAMAGE]: (event, combatants) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        for (const target of event.damageTargets) {
            const targetToUpdate = combatantDictionary[target.targetCombatantID];
            if (!targetToUpdate) {
                continue;
            }

            const newCharacter: Character = changePoints(
                targetToUpdate.character,
                target.amount,
                event.damageType,
            );
            targetToUpdate.character = newCharacter;
        }

        return combatantDictionary;
    },
    [CombatEventType.APPLY_POINT_EFFECT]: (event, combatants) => {
        const combatantDictionary = keyCombatantsByID(combatants);

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
    [CombatEventType.APPLY_STATUS_EFFECT]: (event, combatants) => {
        const combatantDictionary = keyCombatantsByID(combatants);

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
    [CombatEventType.CAST_ABILITY]: (event, combatants) => {
        return keyCombatantsByID(combatants);
    },
    [CombatEventType.DECREASE_MODIFIERS]: (event, combatants) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        for (const targetID of event.targetCombatantIDs) {
            const targetToUpdate = combatantDictionary[targetID];
            if (!targetToUpdate) {
                return combatantDictionary;
            }

            const { newCharacter } = decreaseModifierDuration(targetToUpdate.character);
            targetToUpdate.character = newCharacter;
        }

        return combatantDictionary;
    },
    [CombatEventType.DECREASE_TURNS_UNTIL_ACTION]: (
        event: CombatEvent,
        combatants: Combatant[],
    ) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        const updatedCombatants = decreaseTurnsForMonsterCombatantList(
            Object.values(combatantDictionary),
        );

        for (const updatedCombatant of updatedCombatants) {
            combatantDictionary[updatedCombatant.id] = updatedCombatant;
        }

        return combatantDictionary;
    },
    [CombatEventType.RESET_TURN_TIMER]: (event, combatants) => {
        const combatantDictionary = keyCombatantsByID(combatants);

        for (const targetID of event.targetCombatantIDs) {
            const targetToUpdate = combatantDictionary[targetID];
            if (!targetToUpdate) {
                return combatantDictionary;
            }

            if (!(targetToUpdate instanceof MonsterCombatant)) {
                return combatantDictionary;
            }

            targetToUpdate.turnsUntilAction = resetTurnsUntilAction();
        }

        return combatantDictionary;
    },
};

const keyCombatantsByID = (combatants: Combatant[]): CombatantDictionary => {
    const combatantsByID: { [key: string]: Combatant } = combatants.reduce<{
        [key: string]: Combatant;
    }>((accumulator, combatant) => {
        accumulator[combatant.id] = combatant.clone();
        return accumulator;
    }, {});

    return combatantsByID;
};
