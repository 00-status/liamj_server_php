import { Character } from '../../CharacterMaker';

export type DialogueTree = {
    id: string;
    name: string;
    dialogues: Array<Dialogue>;
    skillTests: Array<SkillTest>;
    nodeCoordinates: NodeCoordinate;
};

export type NodeCoordinate = Map<number, { x: number; y: number }>;

export type Dialogue = {
    id: number;
    name: string;
    character: Character | null;
    description: string;
    hiddenInfo: Array<HiddenInfo>;
    choices: Array<Choice>;
};

export type HiddenInfo = {
    id: string;
    conditionIDs: Array<HiddenInfoCondition>;
    description: string;
};

export type HiddenInfoCondition = {
    id: string;
    name: string;
};

export type Choice = {
    id: string;
    conditionID: string | null;
    nextDialogueID: string;
    shortDescription: string;
    conditionOutcomes: Array<ConditionOutcome>;
    addToHistory: boolean;
};

export type SkillTest = {
    id: number;
    name: string;
    skillID: string;
    difficulties: Array<SkillTestDifficulty>;
    nextDialogueID: number | null;
};

export type SkillTestDifficulty = {
    id: number;
    threshold: number;
    conditionOutcomes: Array<ConditionOutcome>;
};

export type ConditionOutcome = {
    id: string;
    conditionName: string;
    addingOrRemoving: string;
};

export type UnknownObject = {
    [key: string]: unknown;
};
