import { Dialogue } from '../domain/types';

import { DialogueMaker } from './DialogueMaker';

type Props = {
    dialogues: Array<Dialogue>;
    currentDialogue: Dialogue | null;
    setDialogues: (arg: Array<Dialogue>) => void;
    setCurrentDialogue: (arg: Dialogue | null) => void;
};

export const DialogueMakerContainer = (props: Props) => {
    const { dialogues, currentDialogue, setCurrentDialogue, setDialogues } = props;

    const onSave = (updatedDialogue: Dialogue) => {
        const dialoguesCopy = [...dialogues];

        const currentDialogueIndex = dialogues.findIndex(
            (dialogue) => dialogue.id === updatedDialogue.id,
        );

        if (currentDialogueIndex === -1) {
            return;
        }

        dialoguesCopy[currentDialogueIndex] = updatedDialogue;

        setCurrentDialogue(updatedDialogue);
        setDialogues(dialoguesCopy);
    };

    const onDelete = () => {
        if (dialogues.length === 1 || !currentDialogue) {
            return;
        }

        const currentDialogueIndex = dialogues.findIndex(
            (dialogue) => dialogue.id === currentDialogue.id,
        );
        if (currentDialogueIndex === -1) {
            return;
        }

        const dialoguesCopy = [...dialogues];
        dialoguesCopy.splice(currentDialogueIndex, 1);

        setCurrentDialogue(null);
        setDialogues(dialoguesCopy);
    };

    return currentDialogue ? (
        <DialogueMaker dialogue={currentDialogue} onSave={onSave} onDelete={onDelete} />
    ) : null;
};
