import { DialogueTree } from './types';
import { validateDialogueTree } from './validateDialogueTree';

const nodeCoordinates: SerializedMap = [
    [1, { x: -0.49275321906224445, y: -0.01206896479437589 }],
    [2, { x: -0.0303340534111972, y: 0.5068965430098933 }],
];
const testData = {
    id: 'tree_1',
    name: 'Tree 1',
    dialogues: [
        {
            id: 1,
            name: 'Dialogue 1',
            character: {
                id: '37024430-4590-45c3-b3c8-9d09ea0a99fd',
                referenceID: 'john',
                name: 'John',
                nameColor: '',
            },
            description: '',
            hiddenInfo: [
                {
                    id: '3749135c-ab72-42c0-b7e4-2ee51a1a1376',
                    conditionIDs: [
                        { id: 'high_insight', name: 'High Insight' },
                        { id: 'high_faith', name: 'High Faith' },
                    ],
                    description: 'You notice the guard behind her is smiling to themselves.',
                },
            ],
            choices: [
                {
                    id: '3e5359b2-f21f-4aff-82b1-eba2af21b857',
                    conditionID: null,
                    nextDialogueID: '2',
                    shortDescription: '',
                    conditionOutcomes: [],
                },
            ],
        },
        {
            id: 2,
            name: 'Dialogue 2',
            character: null,
            description: '',
            hiddenInfo: [],
            choices: [],
        },
    ],
    skillTests: [],
    nodeCoordinates: nodeCoordinates,
};

export type SerializedMap = Iterable<readonly [number, { x: number; y: number }]>;

describe('validateDialogueTree', () => {
    it('should return a dialogue tree when given a valid dialogue tree', () => {
        const result = validateDialogueTree(testData);

        const expected: DialogueTree = {
            ...testData,
            nodeCoordinates: new Map(testData.nodeCoordinates),
        } as DialogueTree;
        expect(result).toEqual(expected);
    });

    it('should return null when passing in an array', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const testData: Array<any> = [];
        const result = validateDialogueTree(testData);

        expect(result).toEqual(null);
    });

    it('should return null when id is missing', () => {
        const result = validateDialogueTree({ ...testData, id: undefined });

        expect(result).toEqual(null);
    });

    it('should return null when name is missing', () => {
        const result = validateDialogueTree({ ...testData, name: undefined });

        expect(result).toEqual(null);
    });

    it('should return make an empty dialogue array when dialogues are missing', () => {
        const result = validateDialogueTree({ ...testData, dialogues: null });

        const expected: DialogueTree = {
            ...testData,
            dialogues: [],
            nodeCoordinates: new Map(testData.nodeCoordinates),
        };
        expect(result).toEqual(expected);
    });

    it('should return an empty Map when nodeCoordinates is missing', () => {
        const result = validateDialogueTree({ ...testData, nodeCoordinates: undefined });

        const expected: DialogueTree = { ...testData, nodeCoordinates: new Map() } as DialogueTree;
        expect(result).toEqual(expected);
    });

    it('should return an empty Map when dialogueCoordinates is an empty object', () => {
        const result = validateDialogueTree({ ...testData, nodeCoordinates: {} });

        const expected: DialogueTree = { ...testData, nodeCoordinates: new Map() } as DialogueTree;
        expect(result).toEqual(expected);
    });
});
