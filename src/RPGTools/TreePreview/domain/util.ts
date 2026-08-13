import {
    Choice,
    ConditionOutcome,
    Dialogue,
    SkillTest,
} from '../../DialogueTreeMaker/domain/types';

import { Condition, PreviewCharacter, PreviewChoice } from './types';

export const updateConditions = (
    currentConditions: Array<Condition>,
    conditionOutcomes: Array<ConditionOutcome>,
): Array<Condition> => {
    const conditionsCopy = [...currentConditions];

    for (let index = 0; index < conditionOutcomes.length; index++) {
        if (conditionOutcomes[index].addingOrRemoving === 'adding') {
            conditionsCopy.push({
                id: conditionOutcomes[index].id,
                name: conditionOutcomes[index].conditionName,
            });
            continue;
        }

        const conditionToRemoveID = conditionsCopy.findIndex(
            (condition) => condition.id === conditionOutcomes[index].id,
        );

        if (conditionToRemoveID === -1) {
            continue;
        }

        conditionsCopy.splice(conditionToRemoveID, 1);
    }

    return conditionsCopy;
};

export const findNextDialogue = (
    dialogues: Array<Dialogue>,
    skillTests: Array<SkillTest>,
    nextDialogueID: number,
    conditions: Array<Condition>,
): {
    description: string;
    choices: Array<PreviewChoice>;
    character: PreviewCharacter | null;
} | null => {
    const nextDialogue = dialogues.find((dialogue) => dialogue.id === nextDialogueID);

    if (nextDialogue) {
        const conditionsByID = conditions.reduce(
            (acc, condition) => {
                acc[condition.id] = condition;

                return acc;
            },
            {} as { [key: string]: Condition },
        );

        const filteredHiddenInfos = nextDialogue.hiddenInfo.filter((hiddenInfo) => {
            return hiddenInfo.conditionIDs.every((conditionID) => conditionsByID[conditionID.id]);
        });

        const description =
            nextDialogue.description +
            '\n' +
            filteredHiddenInfos.map((hiddenInfo) => hiddenInfo.description + '\n');

        return {
            description: description,
            choices: nextDialogue.choices.map(convertChoiceToPreviewChoice),
            character: nextDialogue.character
                ? { name: nextDialogue.character.name, nameColor: nextDialogue.character.nameColor }
                : { name: 'Unknown', nameColor: '#FCFEFF' },
        };
    }

    const nextSkillTest = skillTests.find((skillTest) => skillTest.id === nextDialogueID);

    if (nextSkillTest) {
        const choices = nextSkillTest.difficulties.map((difficulty) => {
            return {
                id: String(difficulty.id),
                name: 'Threshold: ' + difficulty.threshold,
                prerequisiteIDs: [],
                nextNodeID: nextSkillTest.nextDialogueID ?? -1,
                conditionOutcomes: [...difficulty.conditionOutcomes],
                addToHistory: true,
            };
        });

        return {
            description: nextSkillTest.name + ' | ' + nextSkillTest.skillID,
            choices,
            character: { name: 'Skill Test', nameColor: '#FCFEFF' },
        };
    }

    return null;
};

export const convertChoiceToPreviewChoice = (choice: Choice): PreviewChoice => {
    return {
        id: choice.id,
        name: choice.shortDescription,
        nextNodeID: Number(choice.nextDialogueID),
        prerequisiteIDs: choice.conditionID ? [choice.conditionID] : [],
        conditionOutcomes: choice.conditionOutcomes,
        addToHistory: choice.addToHistory,
    };
};
