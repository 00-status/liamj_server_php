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
            candidatePool = pickNextClosestCandidate(
                potentialMonsters,
                targetThreatScore,
                candidatePool,
            );
        }

        const selectedCandidateIndex = Math.floor(Math.random() * candidatePool.length);
        const selectedMonster = candidatePool[selectedCandidateIndex];

        const characterClone: MonsterCharacter = {
            ...structuredClone(selectedMonster),
            id: crypto.randomUUID(),
            currentHP: selectedMonster.stats.healthPoints,
            currentMP: selectedMonster.stats.magicPoints,
            modifiers: [],
            pointModifiers: [],
        };

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

const BUDGET_SCALE = 50;

export const getEncounterBudget = (clearedFloorCount: number): number => {
    const clampedFloorCount = Math.max(0, clearedFloorCount);

    const budget = (1 + clampedFloorCount) * (BUDGET_SCALE + 2 * clampedFloorCount);
    return budget;
};

const pickNextClosestCandidate = (
    potentialMonsters: MonsterCharacter[],
    targetThreatScore: number,
    candidatePool: MonsterCharacter[],
) => {
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
    return candidatePool;
};
