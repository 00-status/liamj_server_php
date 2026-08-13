import { Dialogue, DialogueTree, SkillTest, UnknownObject } from './types';
import { SerializedMap } from './validateDialogueTree.test';

// TOOD: We should really check the sub-properties as well here.
// At the moment, if a dialogue or dialoguecoordinate is typed incorrectly, we won't catch it here.
export const validateDialogueTree = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dialogueTree: Array<any> | UnknownObject,
): DialogueTree | null => {
    if (Array.isArray(dialogueTree)) {
        return null;
    }

    const dialogueTreeBase = getTreeBaseProperties(dialogueTree);

    if (!dialogueTreeBase) {
        return null;
    }

    const dialogues = getDialogues(dialogueTree);
    const skillTests = getSkillTests(dialogueTree);

    const hasNodeCoordinates = Array.isArray(dialogueTree.nodeCoordinates);
    const nodeCoordinatesMap = hasNodeCoordinates
        ? new Map(dialogueTree.nodeCoordinates as SerializedMap)
        : new Map();

    const dialogueTreeTyped: DialogueTree = {
        ...dialogueTreeBase,
        dialogues: dialogues ?? [],
        skillTests: skillTests ?? [],
        nodeCoordinates: nodeCoordinatesMap,
    };

    return dialogueTreeTyped;
};

const getTreeBaseProperties = (
    dialogueTree: UnknownObject,
): { id: string; name: string } | null => {
    if (typeof dialogueTree.id === 'string' && typeof dialogueTree.name === 'string') {
        return {
            id: dialogueTree.id,
            name: dialogueTree.name,
        };
    }

    return null;
};

const getDialogues = (dialogueTree: UnknownObject): Array<Dialogue> | null => {
    if (!Array.isArray(dialogueTree.dialogues)) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dialogues = dialogueTree.dialogues as Array<any>;

    const isDialogueListValid = dialogues.every((dialogue) => {
        if (
            typeof dialogue.id === 'number' &&
            typeof dialogue.name === 'string' &&
            typeof dialogue.description === 'string' &&
            Array.isArray(dialogue.hiddenInfo) &&
            Array.isArray(dialogue.choices)
        ) {
            return true;
        }

        return false;
    });

    if (isDialogueListValid) {
        return dialogues as Array<Dialogue>;
    }

    return null;
};

const getSkillTests = (dialogueTree: UnknownObject): Array<SkillTest> | null => {
    if (!Array.isArray(dialogueTree.skillTests)) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const skillTests = dialogueTree.skillTests as Array<any>;

    const isSkillTestListValid = skillTests.every((skillTest) => {
        if (
            typeof skillTest.id === 'number' &&
            typeof skillTest.name === 'string' &&
            typeof skillTest.skillID === 'string' &&
            Array.isArray(skillTest.difficulties) &&
            (typeof skillTest.nextDialogueID === 'number' || skillTest.nextDialogueID === null)
        ) {
            return true;
        }

        return false;
    });

    if (isSkillTestListValid) {
        return skillTests as Array<SkillTest>;
    }

    return null;
};
