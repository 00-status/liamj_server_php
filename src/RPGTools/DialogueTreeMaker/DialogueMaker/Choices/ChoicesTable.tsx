import { Fragment, useState } from 'react';

import './choices-table.css';
import { Choice } from '../../domain/types';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import { Card } from '../../../../SharedComponents/Card/Card';
import { Icon } from '../../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../../SharedComponents/Icon/domain';

import { ChoiceModal } from './ChoiceModal';

type Props = {
    choices: Array<Choice>;
    onChange: (choices: Array<Choice>) => void;
};

export const ChoicesTable = (props: Props) => {
    const { choices, onChange } = props;

    const [currentChoice, setCurrentChoice] = useState<Choice | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const updateChoice = (newChoice: Choice) => {
        const choicesCopy = [...choices];
        const choiceIndex = choicesCopy.findIndex((choice) => choice.id === newChoice.id);

        if (choiceIndex === -1) {
            choicesCopy.push(newChoice);
        } else {
            choicesCopy[choiceIndex] = newChoice;
        }

        onChange(choicesCopy);
    };

    const deleteChoice = (id: string) => {
        const choicesCopy = [...choices];
        const choiceToDeleteIndex = choicesCopy.findIndex((choice) => choice.id === id);

        if (choiceToDeleteIndex === -1) {
            return;
        }

        choicesCopy.splice(choiceToDeleteIndex, 1);
        onChange(choicesCopy);
    };

    const newChoiceButton = (
        <Button onClick={() => setIsModalOpen(true)}>
            <Icon iconType={IconType.PLUS} />
            Add Choice
        </Button>
    );

    return (
        <Card title="Choices" button={newChoiceButton}>
            <div className="choices-table">
                <div className="choices-table__header">Condition ID</div>
                <div className="choices-table__header">Short description</div>
                <div className="choices-table__header">Next dialogue ID</div>
                <div className="choices-table__header">Outcomes</div>
                <div className="choices-table__header">Add to history</div>
                <div />
                {choices.map((choice) => {
                    return (
                        <Fragment key={choice.id}>
                            <div>{choice.conditionID}</div>
                            <div>{choice.shortDescription}</div>
                            <div>{choice.nextDialogueID}</div>
                            <div>
                                {choice.conditionOutcomes.map((outcome) => (
                                    <div key={outcome.id}>
                                        {(outcome.addingOrRemoving === 'adding' ? '+ ' : '- ') +
                                            outcome.id}
                                    </div>
                                ))}
                            </div>
                            <div>{choice.addToHistory ? 'true' : 'false'}</div>
                            <div className="choices-table__item--actions">
                                <Button
                                    onClick={() => {
                                        setCurrentChoice(choice);
                                        setIsModalOpen(true);
                                    }}
                                >
                                    <Icon iconType={IconType.PENCIL} />
                                </Button>
                                <Button
                                    onClick={() => deleteChoice(choice.id)}
                                    buttonTheme={ButtonTheme.Delete}
                                >
                                    <Icon iconType={IconType.TRASH} />
                                </Button>
                            </div>
                        </Fragment>
                    );
                })}
            </div>
            <ChoiceModal
                choice={currentChoice}
                isOpen={isModalOpen}
                onSave={updateChoice}
                onClose={() => {
                    setCurrentChoice(null);
                    setIsModalOpen(false);
                }}
            />
        </Card>
    );
};
