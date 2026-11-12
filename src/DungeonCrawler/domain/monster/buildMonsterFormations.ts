import { MonsterCombatant } from '../Combatant';
import { roomTemplates } from '../constants';
import type { Formation } from '../formation/types';
import { FormationTeam } from '../formation/types';
import type { MonsterCharacter } from '../types';

import { resetTurnsUntilAction } from './turnsUntilAction';

const GRID_WIDTH_HEIGHT = 3;
const BUDGET_TOLERANCE_PERCENTAGE = 0.1;

export const buildMonsterFormation = (
    clearedFloorCount: number,
    potentialMonsters: MonsterCharacter[],
): Formation => {
    if (potentialMonsters.length === 0) {
        throw new Error('Cannot build monster formation from empty monster list!');
    }

    const eligibleRoomTemplates = roomTemplates.filter((roomTemplate) => {
        return roomTemplate.floorCountRequirement <= Math.max(0, clearedFloorCount);
    });

    if (eligibleRoomTemplates.length === 0) {
        throw new Error('No eligible room templates found for the given floor count!');
    }

    const selectedTemplateIndex = Math.floor(Math.random() * eligibleRoomTemplates.length);
    const selectedTemplate = eligibleRoomTemplates[selectedTemplateIndex];

    const totalWeight = selectedTemplate.slots.reduce((accumulator, slot) => {
        return accumulator + (slot.threatWeight ?? 1);
    }, 0);

    const encounterBudget = getEncounterBudget(clearedFloorCount);

    const combatants = selectedTemplate.slots.map((slot) => {
        const slotWeight = slot.threatWeight ?? 1;
        const normalizedWeight = slotWeight / totalWeight;
        const targetThreatScore = encounterBudget * normalizedWeight;

        const minimumThreatScore = targetThreatScore * (1 - BUDGET_TOLERANCE_PERCENTAGE);
        const maximumThreatScore = targetThreatScore * (1 + BUDGET_TOLERANCE_PERCENTAGE);

        const candidateMonsters = potentialMonsters.filter((monster) => {
            return (
                monster.threatScore >= minimumThreatScore &&
                monster.threatScore <= maximumThreatScore
            );
        });

        let candidatePool = candidateMonsters;

        if (candidatePool.length === 0) {
            let smallestThreatDifference = Infinity;
            for (const monster of potentialMonsters) {
                const threatDifference = Math.abs(monster.threatScore - targetThreatScore);
                if (threatDifference < smallestThreatDifference) {
                    smallestThreatDifference = threatDifference;
                }
            }

            candidatePool = potentialMonsters.filter((monster) => {
                const threatDifference = Math.abs(monster.threatScore - targetThreatScore);
                return threatDifference === smallestThreatDifference;
            });
        }

        const selectedCandidateIndex = Math.floor(Math.random() * candidatePool.length);
        const selectedMonster = candidatePool[selectedCandidateIndex];

        const characterClone = structuredClone(selectedMonster);
        characterClone.id = crypto.randomUUID();
        characterClone.currentHP = characterClone.stats.healthPoints;
        characterClone.currentMP = characterClone.stats.magicPoints;
        characterClone.modifiers = [];
        characterClone.pointModifiers = [];

        return new MonsterCombatant(
            crypto.randomUUID(),
            characterClone,
            { ...slot.position },
            resetTurnsUntilAction(),
            [],
        );
    });

    return {
        id: crypto.randomUUID(),
        team: FormationTeam.MONSTER,
        gridDimensions: { x: GRID_WIDTH_HEIGHT, y: GRID_WIDTH_HEIGHT },
        combatants,
    };
};

export interface EncounterBudgetConfig {
    floorCountRequirement: number;
    encounterBudget: number;
}
export const encounterBudgets: EncounterBudgetConfig[] = [
    { floorCountRequirement: 0, encounterBudget: 150 },
    { floorCountRequirement: 1, encounterBudget: 252 },
    { floorCountRequirement: 2, encounterBudget: 504 },
    { floorCountRequirement: 3, encounterBudget: 756 },
    { floorCountRequirement: 4, encounterBudget: 1008 },
    { floorCountRequirement: 5, encounterBudget: 1260 },
    { floorCountRequirement: 6, encounterBudget: 1512 },
    { floorCountRequirement: 7, encounterBudget: 2520 },
];

export const getEncounterBudget = (clearedFloorCount: number): number => {
    const clampedFloorCount = Math.max(0, clearedFloorCount);
    const highestConfiguredBudget = encounterBudgets[encounterBudgets.length - 1];

    if (clampedFloorCount >= highestConfiguredBudget.floorCountRequirement) {
        const extraFloorCount = clampedFloorCount - highestConfiguredBudget.floorCountRequirement;
        const budgetScalingStep = 1008;

        return highestConfiguredBudget.encounterBudget + extraFloorCount * budgetScalingStep;
    }

    const eligibleBudgets = encounterBudgets
        .filter((budgetConfig) => budgetConfig.floorCountRequirement <= clampedFloorCount)
        .sort(
            (budgetConfigA, budgetConfigB) =>
                budgetConfigB.floorCountRequirement - budgetConfigA.floorCountRequirement,
        );

    if (!eligibleBudgets) {
        return encounterBudgets[0].encounterBudget;
    }

    return eligibleBudgets[0].encounterBudget;
};
