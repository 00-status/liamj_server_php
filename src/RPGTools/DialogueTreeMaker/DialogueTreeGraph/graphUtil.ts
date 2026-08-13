import { SerializedEdge, SerializedNode } from 'graphology-types';

import { Dialogue, NodeCoordinate, SkillTest } from '../domain/types';

export const convertDialoguesToNodes = (
    dialogues: Array<Dialogue>,
    skillTests: Array<SkillTest>,
    nodeCoordinates: NodeCoordinate,
): Array<SerializedNode> => {
    const createNode = (id: number, name: string, type: string, customColor?: string) => {
        const nodeCoordinate = nodeCoordinates.get(id);

        return {
            key: String(id),
            node: id,
            attributes: {
                x: nodeCoordinate?.x ?? 0,
                y: nodeCoordinate?.y ?? 0,
                label: name,
                size: 20,
                color: customColor ?? '#d6a840',
                type: type === 'skillTest' ? 'square' : undefined,
            },
        };
    };

    const dialogueNodes = dialogues.map((dialogue) =>
        createNode(dialogue.id, dialogue.name, 'dialogue', dialogue.character?.nameColor),
    );

    const skillTestNodes = skillTests.map((skillTest) =>
        createNode(skillTest.id, skillTest.name, 'skillTest'),
    );

    return [...dialogueNodes, ...skillTestNodes];
};

export const convertDialoguesToEdges = (
    dialogues: Array<Dialogue>,
    skillTests: Array<SkillTest>,
): Array<SerializedEdge> => {
    const nodes: Array<Dialogue | SkillTest> = [...dialogues, ...skillTests];

    const nodeIDsById = nodes.reduce(
        (acc, node) => {
            acc[node.id] = node.id;
            return acc;
        },
        {} as { [key: number]: number | undefined },
    );

    const mappedEdges = dialogues.reduce<Array<SerializedEdge>>((acc, dialogue) => {
        const edges: Array<SerializedEdge> = dialogue.choices
            .filter((choice, position) => {
                // TODO: Make this more efficient
                const firstChoiceOccurance = dialogue.choices.findIndex(
                    (innerChoice) => innerChoice.nextDialogueID == choice.nextDialogueID,
                );

                const isUniqueChoice = firstChoiceOccurance === position;
                const doesNextNodeExist = nodeIDsById[Number(choice.nextDialogueID)];

                return doesNextNodeExist && isUniqueChoice;
            })
            .map((choice) => {
                return {
                    key: dialogue.id + '-' + choice.nextDialogueID,
                    source: String(dialogue.id),
                    target: choice.nextDialogueID,
                    attributes: { type: 'arrow', size: 4, undirected: false },
                };
            });

        return [...acc, ...edges];
    }, []);

    const skillTestEdges: Array<SerializedEdge> = skillTests
        .filter((skillTest) => nodeIDsById[skillTest.nextDialogueID ?? -1])
        .map((skillTest) => {
            return {
                key: skillTest.id + '-' + skillTest.nextDialogueID,
                source: String(skillTest.id),
                target: String(skillTest.nextDialogueID),
                attributes: { type: 'arrow', size: 4, undirected: false },
            };
        });

    return [...mappedEdges, ...skillTestEdges];
};
