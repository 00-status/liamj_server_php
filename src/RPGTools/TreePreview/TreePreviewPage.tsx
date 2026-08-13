import { useEffect, useRef, useState } from 'react';

import './tree-preview-page.css';
import { Page } from '../../SharedComponents/Page/Page';
import { useDialogueTree } from '../DialogueTreeMaker/useDialogueTree';
import { RPGRoutes } from '../domain';
import { ConditionOutcome } from '../DialogueTreeMaker/domain/types';

import { ChoiceButton } from './ChoiceButton';
import { convertChoiceToPreviewChoice, findNextDialogue, updateConditions } from './domain/util';
import { HistoryItem } from './HistoryItem';
import { Condition, DialogueHistory, PreviewChoice } from './domain/types';

const TreePreviewPage = () => {
    const { dialogues, skillTests } = useDialogueTree();

    const [histories, setHistories] = useState<Array<DialogueHistory>>([]);
    const [currentChoices, setCurrentChoices] = useState<Array<PreviewChoice>>([]);

    const [conditions, setConditions] = useState<Array<Condition>>([]);

    const historyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (histories.length > 0) {
            return;
        }

        const startingDialogue = dialogues.find((dialogue) => dialogue.id === 1);

        if (!startingDialogue) {
            return;
        }

        const character = startingDialogue.character
            ? {
                  name: startingDialogue.character.name,
                  nameColor: startingDialogue.character.nameColor,
              }
            : null;

        setHistories([
            ...histories,
            {
                id: crypto.randomUUID(),
                description: startingDialogue.description,
                character,
                isChoice: false,
            },
        ]);
        setCurrentChoices([...startingDialogue.choices.map(convertChoiceToPreviewChoice)]);
    }, [dialogues, histories]);

    const onChoiceClick = (
        nextDialogueID: number,
        description: string,
        addToHistory: boolean,
        conditionOutcomes: Array<ConditionOutcome>,
    ) => {
        const updatedConditions = updateConditions(conditions, conditionOutcomes);
        const nextDialogue = findNextDialogue(
            dialogues,
            skillTests,
            nextDialogueID,
            updatedConditions,
        );

        if (!nextDialogue) {
            return;
        }

        const choiceHistory: DialogueHistory = {
            id: crypto.randomUUID(),
            description,
            character: null,
            isChoice: true,
        };
        const nextDialogueHistory: DialogueHistory = {
            id: crypto.randomUUID(),
            description: nextDialogue.description,
            character: nextDialogue.character,
            isChoice: false,
        };

        const historiesToAdd = addToHistory
            ? [choiceHistory, nextDialogueHistory]
            : [nextDialogueHistory];

        setConditions(updatedConditions);
        setHistories([...histories, ...historiesToAdd]);
        setCurrentChoices([...nextDialogue.choices]);
    };

    useEffect(() => {
        if (historyRef.current) {
            historyRef.current.scrollTop = historyRef.current.scrollHeight;
        }
    }, [historyRef, histories]);

    return (
        <Page routes={RPGRoutes} title="RPG Tools">
            <div className="tree-preview-page">
                <h1>Dialogue Tree Preview</h1>
                <div className="tree-preview-page__container">
                    <div className="tree-preview-page__active-conditions">
                        <h3>Active Conditions</h3>
                        {conditions.map((condition) => (
                            <div key={condition.id}>
                                {condition.id} : {condition.name}
                            </div>
                        ))}
                    </div>
                    <div className="tree-preview-page__content">
                        <div ref={historyRef} className="tree-preview-page__history">
                            {histories.map((history) => (
                                <HistoryItem key={history.id} history={history} />
                            ))}
                        </div>
                        <div className="tree-preview-page__choices">
                            {currentChoices.map((choice) => (
                                <ChoiceButton
                                    key={choice.id}
                                    choice={choice}
                                    currentConditions={conditions}
                                    onClick={onChoiceClick}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default TreePreviewPage;
