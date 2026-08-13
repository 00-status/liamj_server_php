import { useEffect, useState } from 'react';

import { Dialogue, NodeCoordinate, DialogueTree, SkillTest } from './domain/types';
import { validateDialogueTree } from './domain/validateDialogueTree';

type UseDialogueTree = {
    dialogueTreeID: string;
    dialogueTreeName: string;
    dialogues: Array<Dialogue>;
    skillTests: Array<SkillTest>;
    nodeCoordinates: NodeCoordinate;
    setDialogueTreeID: (id: string) => void;
    setDialogueTreeName: (name: string) => void;
    setDialogues: (dialogues: Array<Dialogue>) => void;
    setSkillTests: (skillTests: Array<SkillTest>) => void;
    setDialogueCoordinates: (nodeCoordinates: NodeCoordinate) => void;
};

export const useDialogueTree = (): UseDialogueTree => {
    const [dialogueTreeID, setDialogueTreeID] = useState<string>('tree_1');
    const [dialogueTreeName, setDialogueTreeName] = useState<string>('Tree 1');
    const [dialogues, setDialogues] = useState<Array<Dialogue>>([]);
    const [skillTests, setSkillTests] = useState<Array<SkillTest>>([]);
    const [nodeCoordinates, setDialogueCoordinates] = useState<NodeCoordinate>(new Map());

    useEffect(() => {
        const dialogueTreeJson = localStorage.getItem('dialogueTree');

        if (!dialogueTreeJson) {
            return;
        }

        const dialogueTreeParsed: DialogueTree = JSON.parse(dialogueTreeJson);
        const validTree = validateDialogueTree(dialogueTreeParsed);

        if (!validTree) {
            return;
        }

        setDialogueTreeID(validTree.id);
        setDialogueTreeName(validTree.name);
        setDialogues(validTree.dialogues);
        setSkillTests(validTree.skillTests ?? []);
        setDialogueCoordinates(validTree.nodeCoordinates);
    }, []);

    useEffect(() => {
        const dialogueTree = {
            id: dialogueTreeID,
            name: dialogueTreeName,
            dialogues,
            skillTests,
            nodeCoordinates: Array.from(nodeCoordinates.entries()),
        };
        const serializedDialogueTree = JSON.stringify(dialogueTree);

        localStorage.setItem('dialogueTree', serializedDialogueTree);
    }, [dialogueTreeID, dialogueTreeName, dialogues, skillTests, nodeCoordinates]);

    return {
        dialogueTreeID,
        dialogueTreeName,
        dialogues,
        skillTests,
        nodeCoordinates,
        setDialogues,
        setSkillTests,
        setDialogueTreeID,
        setDialogueTreeName,
        setDialogueCoordinates,
    };
};
