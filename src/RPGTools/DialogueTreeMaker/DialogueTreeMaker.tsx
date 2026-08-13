import { ReactElement, useState } from 'react';

import './dialogue-tree-maker.css';
import { Page } from '../../SharedComponents/Page/Page';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { ButtonLink } from '../../SharedComponents/ButtonLink/ButtonLink';
import { JSONFileInput } from '../../SharedComponents/FileInput/JSONFileInput';
import { RPGRoutes } from '../domain';
import { Icon } from '../../SharedComponents/Icon/Icon';
import { IconType } from '../../SharedComponents/Icon/domain';

import { Dialogue, SkillTest, UnknownObject } from './domain/types';
import { DialogueTreeGraph } from './DialogueTreeGraph/DialogueTreeGraph';
import { useDialogueTree } from './useDialogueTree';
import { getDownloadLink } from './domain/getDownloadLink';
import { validateDialogueTree } from './domain/validateDialogueTree';
import { DialogueMakerContainer } from './DialogueMaker/DialogueMakerContainer';
import { SkillTestMakerContainer } from './SkillTestMaker/SkillTestMakerContainer';
import { GraphContainer } from './DialogueTreeGraph/GraphContainer';

const DialogueTreeMaker = (): ReactElement => {
    const {
        dialogueTreeID,
        dialogueTreeName,
        dialogues,
        skillTests,
        nodeCoordinates,
        setDialogueTreeID,
        setDialogueTreeName,
        setDialogues,
        setSkillTests,
        setDialogueCoordinates,
    } = useDialogueTree();

    const [currentDialogue, setCurrentDialogue] = useState<Dialogue | null>(null);
    const [currentSkillTest, setCurrentSkillTest] = useState<SkillTest | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadDialogueTree = (parsedTree: Array<any> | UnknownObject) => {
        const dialogueTree = validateDialogueTree(parsedTree);

        if (!dialogueTree) {
            return;
        }

        resetDialogueTree();

        setDialogueTreeID(dialogueTree.id);
        setDialogueTreeName(dialogueTree.name);
        setDialogues(dialogueTree.dialogues);
        setSkillTests(dialogueTree.skillTests);
        setDialogueCoordinates(dialogueTree.nodeCoordinates);
    };

    const resetDialogueTree = () => {
        setDialogueTreeID('');
        setDialogueTreeName('');
        setDialogues([]);
        setSkillTests([]);
        setDialogueCoordinates(new Map());
    };

    const createNewDialogue = () => {
        const lastDialogueNumber = dialogues.length !== 0 ? dialogues[dialogues.length - 1].id : 0;

        const newDialogue = {
            id: lastDialogueNumber + 1,
            name: 'Dialogue ' + (Number(lastDialogueNumber) + 1),
            character: null,
            description: '',
            hiddenInfo: [],
            choices: [],
        };

        setDialogues([...dialogues, newDialogue]);
    };

    const createNewSkillTest = () => {
        const newSkillTest: SkillTest = {
            id: Math.trunc(Date.now() + Math.random()),
            name: 'New Skill Test',
            skillID: '',
            difficulties: [],
            nextDialogueID: null,
        };

        setSkillTests([...skillTests, newSkillTest]);
    };

    const onNodeClick = (nodeID: number) => {
        const newCurrentDialogue = dialogues.find((dialogue) => dialogue.id === nodeID) ?? null;
        const newCurrentSkillTest = skillTests.find((skillTest) => skillTest.id === nodeID) ?? null;

        if (!newCurrentDialogue && !newCurrentSkillTest) {
            return;
        }

        if (newCurrentDialogue && newCurrentSkillTest) {
            throw new Error('Cannot have two nodes with the same ID!');
        }

        setCurrentDialogue(newCurrentDialogue);
        setCurrentSkillTest(newCurrentSkillTest);
    };

    const onNodeMoveFinish = (id: number, x: number, y: number) => {
        setDialogueCoordinates(new Map(nodeCoordinates.set(id, { x, y })));
    };

    return (
        <Page title="RPG Tools" routes={RPGRoutes}>
            <div className="dialogue-tree-maker">
                <div className="dialogue-tree-maker__title">
                    <h1>Dialogue Tree Maker</h1>
                    {dialogueTreeID && (
                        <ButtonLink
                            download={dialogueTreeID + '.json'}
                            href={getDownloadLink({
                                id: dialogueTreeID,
                                name: dialogueTreeName,
                                dialogues,
                                skillTests,
                                nodeCoordinates: nodeCoordinates,
                            })}
                        >
                            <Icon iconType={IconType.DOANLOAD} />
                            Download tree
                        </ButtonLink>
                    )}
                    <Button buttonTheme={ButtonTheme.Delete} onClick={resetDialogueTree}>
                        <Icon iconType={IconType.TRASH} />
                        Delete Tree
                    </Button>
                </div>
                <div className="dialogue-tree-maker__form">
                    <JSONFileInput
                        id="dialogue-tree-upload"
                        name="Upload Dialogue Tree"
                        onChange={uploadDialogueTree}
                    />
                    <TextInput
                        id="dialogue-tree-id"
                        label="Dialogue tree ID"
                        value={dialogueTreeID}
                        onChange={(newValue) => {
                            setDialogueTreeID(newValue ?? '');
                        }}
                    />
                    <TextInput
                        id="dialogue-tree-name"
                        label="Dialogue tree name"
                        value={dialogueTreeName}
                        onChange={(newValue) => {
                            setDialogueTreeName(newValue ?? '');
                        }}
                    />
                </div>
                <div className="dialogue-tree-maker--content">
                    <div>
                        <div className="dialogue-tree-maker__dialogue-tree-title">
                            <h2>Dialogue Tree</h2>
                            <Button onClick={createNewDialogue}>
                                <Icon iconType={IconType.PLUS} /> Create dialogue
                            </Button>
                            <Button onClick={createNewSkillTest}>
                                <Icon iconType={IconType.PLUS} /> Create skill test
                            </Button>
                        </div>
                        <GraphContainer>
                            <DialogueTreeGraph
                                dialogues={dialogues}
                                skillTests={skillTests}
                                nodeCoordinates={nodeCoordinates}
                                onDialogueClick={onNodeClick}
                                onDialogueMoveFinish={onNodeMoveFinish}
                            />
                        </GraphContainer>
                    </div>
                    <hr className="divider" />
                    <DialogueMakerContainer
                        dialogues={dialogues}
                        currentDialogue={currentDialogue}
                        setDialogues={setDialogues}
                        setCurrentDialogue={setCurrentDialogue}
                    />
                    <SkillTestMakerContainer
                        skillTests={skillTests}
                        currentSkillTest={currentSkillTest}
                        setSkillTests={setSkillTests}
                        setCurrentSkillTest={setCurrentSkillTest}
                    />
                </div>
            </div>
        </Page>
    );
};

export default DialogueTreeMaker;
