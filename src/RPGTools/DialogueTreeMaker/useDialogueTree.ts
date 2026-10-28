import { useEffect, useState } from 'react';

import type { Dialogue, NodeCoordinate, DialogueTree, SkillTest } from './domain/types';
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

const loadSavedDialogueTree = (): DialogueTree | null => {
    const dialogueTreeJson = localStorage.getItem('dialogueTree');

    if (!dialogueTreeJson) {
        return null;
    }

    try {
        const dialogueTreeParsed: DialogueTree = JSON.parse(dialogueTreeJson);
        const validTree = validateDialogueTree(dialogueTreeParsed);

        return validTree;
    } catch {
        return null;
    }
};

export const useDialogueTree = (): UseDialogueTree => {
    const [savedTree] = useState<DialogueTree | null>(() => loadSavedDialogueTree());

    const [dialogueTreeID, setDialogueTreeID] = useState<string>(() => savedTree?.id ?? 'tree_1');
    const [dialogueTreeName, setDialogueTreeName] = useState<string>(
        () => savedTree?.name ?? 'Tree 1',
    );
    const [dialogues, setDialogues] = useState<Array<Dialogue>>(() => savedTree?.dialogues ?? []);
    const [skillTests, setSkillTests] = useState<Array<SkillTest>>(
        () => savedTree?.skillTests ?? [],
    );
    const [nodeCoordinates, setNodeCoordinates] = useState<NodeCoordinate>(
        () => savedTree?.nodeCoordinates ?? new Map(),
    );

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
        setDialogueCoordinates: setNodeCoordinates,
    };
};
