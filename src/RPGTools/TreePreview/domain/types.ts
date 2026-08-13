import { ConditionOutcome } from '../../DialogueTreeMaker/domain/types';

export type PreviewCharacter = { name: string; nameColor: string };
export type DialogueHistory = {
    id: string;
    description: string;
    character: PreviewCharacter | null;
    isChoice: boolean;
};

export type Condition = {
    id: string;
    name: string;
};

export type PreviewChoice = {
    id: string;
    name: string;
    nextNodeID: number;
    prerequisiteIDs: Array<string>;
    conditionOutcomes: Array<ConditionOutcome>;
    addToHistory: boolean;
};
