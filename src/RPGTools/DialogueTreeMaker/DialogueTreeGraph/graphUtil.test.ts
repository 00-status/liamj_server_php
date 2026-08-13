import { SerializedEdge } from 'graphology-types';

import { Choice, Dialogue, SkillTest } from '../domain/types';

import { convertDialoguesToEdges, convertDialoguesToNodes } from './graphUtil';

describe('graphUtil', () => {
    describe('convertAreasToNodes', () => {
        it('should convert areas to a list of nodes', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                } as Dialogue,
                {
                    id: 2,
                    name: 'Area two',
                    description: 'Description two',
                } as Dialogue,
            ];

            const result = convertDialoguesToNodes(areas, [], new Map());

            expect(result).toEqual([
                {
                    key: '1',
                    node: 1,
                    attributes: { x: 0, y: 0, label: 'Area one', size: 20, color: '#d6a840' },
                },
                {
                    key: '2',
                    node: 2,
                    attributes: { x: 0, y: 0, label: 'Area two', size: 20, color: '#d6a840' },
                },
            ]);
        });

        it('should convert areas to a list of nodes with x and y coords provided', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                } as Dialogue,
                {
                    id: 2,
                    name: 'Area two',
                    description: 'Description two',
                } as Dialogue,
            ];

            const coordsMap = new Map([[1, { x: 1, y: 2 }]]);

            const result = convertDialoguesToNodes(areas, [], coordsMap);

            expect(result).toEqual([
                {
                    key: '1',
                    node: 1,
                    attributes: { x: 1, y: 2, label: 'Area one', size: 20, color: '#d6a840' },
                },
                {
                    key: '2',
                    node: 2,
                    attributes: { x: 0, y: 0, label: 'Area two', size: 20, color: '#d6a840' },
                },
            ]);
        });

        it('should return an empty array when the dialogue list is empty', () => {
            const result = convertDialoguesToNodes([], [], new Map());
            expect(result).toHaveLength(0);
        });

        it('should convert SkillTests to Nodes', () => {
            const skillTests: Array<SkillTest> = [
                {
                    id: 1,
                    name: 'Skill Test 1',
                } as SkillTest,
            ];

            const result = convertDialoguesToNodes([], skillTests, new Map());

            expect(result).toEqual([
                {
                    key: '1',
                    node: 1,
                    attributes: {
                        x: 0,
                        y: 0,
                        label: 'Skill Test 1',
                        size: 20,
                        color: '#d6a840',
                        type: 'square',
                    },
                },
            ]);
        });

        it("should be the associated character's color", () => {
            const dialogues: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'node one',
                    description: 'Description one',
                    character: { nameColor: '#FFFFFF' },
                } as Dialogue,
            ];

            const result = convertDialoguesToNodes(dialogues, [], new Map());

            expect(result).toEqual([
                {
                    key: '1',
                    node: 1,
                    attributes: { x: 0, y: 0, label: 'node one', size: 20, color: '#FFFFFF' },
                },
            ]);
        });
    });

    describe('convertAreasToEdges', () => {
        it('should return an edge for each choice on a node.', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [
                        {
                            id: 'id_1',
                            conditionID: '',
                            nextDialogueID: '2',
                            shortDescription: 'description 1',
                        },
                        {
                            id: 'id_2',
                            conditionID: '',
                            nextDialogueID: '3',
                            shortDescription: 'description 2',
                        },
                    ],
                } as Dialogue,
                {
                    id: 2,
                    name: 'Area two',
                    description: 'Description two',
                    choices: [] as Array<Choice>,
                } as Dialogue,
                {
                    id: 3,
                    name: 'Area three',
                    description: 'Description three',
                    choices: [] as Array<Choice>,
                } as Dialogue,
            ];

            const result = convertDialoguesToEdges(areas, []);

            const expected: Array<SerializedEdge> = [
                {
                    key: '1-2',
                    source: '1',
                    target: '2',
                    attributes: { size: 4, type: 'arrow', undirected: false },
                },
                {
                    key: '1-3',
                    source: '1',
                    target: '3',
                    attributes: { size: 4, type: 'arrow', undirected: false },
                },
            ];
            expect(result).toEqual(expected);
        });

        it('should NOT map choices that point to nodes that do not exist', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [
                        {
                            id: 'id_1',
                            conditionID: '',
                            nextDialogueID: '45',
                            shortDescription: 'description 1',
                        },
                    ],
                } as Dialogue,
            ];

            const result = convertDialoguesToEdges(areas, []);

            expect(result).toHaveLength(0);
        });

        it('should NOT map choices that have duplicate nextAreaIDs', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Dialogue 1',
                    description: 'Description one',
                    choices: [
                        {
                            id: 'id_1',
                            conditionID: '',
                            nextDialogueID: '2',
                            shortDescription: 'description 1',
                        },
                        {
                            id: 'id_2',
                            conditionID: '',
                            nextDialogueID: '2',
                            shortDescription: 'description 1',
                        },
                    ],
                } as Dialogue,
                {
                    id: 2,
                    name: 'Area two',
                    description: 'Description two',
                    choices: [] as Array<Choice>,
                } as Dialogue,
            ];

            const result = convertDialoguesToEdges(areas, []);

            expect(result).toHaveLength(1);
        });

        it('should return an empty array when areas is empty.', () => {
            const result = convertDialoguesToEdges([], []);
            expect(result).toHaveLength(0);
        });

        it('should return an empty array when each area has no choices.', () => {
            const areas: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [] as Array<Choice>,
                } as Dialogue,
            ];

            const result = convertDialoguesToEdges(areas, []);

            expect(result).toHaveLength(0);
        });

        it('should return an edge for each choice that points to a SkillTest.', () => {
            const dialogues: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [
                        {
                            id: 'id_1',
                            conditionID: '',
                            nextDialogueID: '2',
                            shortDescription: 'description 1',
                        },
                    ],
                } as Dialogue,
            ];
            const skillTests: Array<SkillTest> = [
                { id: 2, name: 'banana', nextDialogueID: 7 } as SkillTest,
            ];

            const result = convertDialoguesToEdges(dialogues, skillTests);

            const expected: Array<SerializedEdge> = [
                {
                    key: '1-2',
                    source: '1',
                    target: '2',
                    attributes: { size: 4, type: 'arrow', undirected: false },
                },
            ];
            expect(result).toEqual(expected);
        });

        it('should return an edge for each SkillTest that points to a Dialogue.', () => {
            const dialogues: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [] as Array<Choice>,
                } as Dialogue,
            ];
            const skillTests: Array<SkillTest> = [
                { id: 2, name: 'banana', nextDialogueID: 1 } as SkillTest,
            ];

            const result = convertDialoguesToEdges(dialogues, skillTests);

            const expected: Array<SerializedEdge> = [
                {
                    key: '2-1',
                    source: '2',
                    target: '1',
                    attributes: { size: 4, type: 'arrow', undirected: false },
                },
            ];
            expect(result).toEqual(expected);
        });

        it('should NOT return an edge when SkillTest points to a Dialogue that does not exist.', () => {
            const dialogues: Array<Dialogue> = [
                {
                    id: 1,
                    name: 'Area one',
                    description: 'Description one',
                    choices: [] as Array<Choice>,
                } as Dialogue,
            ];
            const skillTests: Array<SkillTest> = [
                { id: 2, name: 'banana', nextDialogueID: 7 } as SkillTest,
            ];

            const result = convertDialoguesToEdges(dialogues, skillTests);

            expect(result).toEqual([]);
        });
    });
});
