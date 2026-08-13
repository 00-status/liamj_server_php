import { useEffect, useState, Fragment } from 'react';

import './choice-modal.css';
import { Modal } from '../../../../SharedComponents/Modal/Modal';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { Choice, ConditionOutcome } from '../../domain/types';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import { CheckboxInput } from '../../../../SharedComponents/CheckboxInput/CheckboxInput';
import { Dropdown } from '../../../../SharedComponents/Dropdown/Dropdown';
import { Icon } from '../../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../../SharedComponents/Icon/domain';

const conditionOutcomeOptions = [
    { label: 'Adding', value: 'adding' },
    { label: 'Removing', value: 'removing' },
];

type Props = {
    choice: Choice | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (choice: Choice) => void;
};

export const ChoiceModal = (props: Props) => {
    const { choice, isOpen, onClose, onSave } = props;

    const [conditionID, setConditionID] = useState<string | null>(choice?.conditionID ?? null);
    const [nextDialogueID, setNextDialogueID] = useState<string | null>(
        choice?.nextDialogueID ?? null,
    );
    const [shortDescription, setShortDescription] = useState<string | null>(
        choice?.shortDescription ?? null,
    );
    const [conditionOutcomes, setConditionOutcomes] = useState<Array<ConditionOutcome>>(
        choice?.conditionOutcomes ?? [],
    );
    const [addToHistory, setAddToHistory] = useState<boolean>(choice?.addToHistory ?? false);

    const [conditionOutcomeID, setConditionOutcomeID] = useState<string | null>(null);
    const [conditionName, setConditionName] = useState<string | null>(null);
    const [addingOrRemoving, setAddingOrRemoving] = useState<string>('adding');

    useEffect(() => {
        setConditionID(choice?.conditionID ?? null);
        setNextDialogueID(choice?.nextDialogueID ?? null);
        setShortDescription(choice?.shortDescription ?? null);
        setConditionOutcomes(choice?.conditionOutcomes ?? []);
        setAddToHistory(choice?.addToHistory ?? false);
    }, [choice]);

    const addConditionOutcome = () => {
        if (!conditionOutcomeID || !conditionName || !addingOrRemoving) {
            return;
        }

        const conditionOutcomesCopy = [...conditionOutcomes];

        conditionOutcomesCopy.push({
            id: conditionOutcomeID,
            conditionName,
            addingOrRemoving,
        });

        setConditionOutcomes(conditionOutcomesCopy);
        setAddingOrRemoving('adding');
        setConditionOutcomeID(null);
        setConditionName(null);
    };

    const deleteOutcome = (id: string) => {
        setConditionOutcomes([...conditionOutcomes].filter((outcome) => outcome.id !== id));
    };

    const isSubmitDisabled = !nextDialogueID || !shortDescription;
    const onSubmit = () => {
        if (!nextDialogueID || !shortDescription) {
            return;
        }

        const newChoice: Choice = {
            id: choice?.id ?? crypto.randomUUID(),
            conditionID,
            nextDialogueID,
            shortDescription,
            conditionOutcomes,
            addToHistory,
        };

        onSave(newChoice);
        setConditionID(null);
        setNextDialogueID(null);
        setShortDescription(null);
        setConditionOutcomes([]);
        setAddToHistory(false);
        onClose();
    };

    const submitButton = (
        <Button disabled={isSubmitDisabled} onClick={onSubmit}>
            Save
        </Button>
    );

    return (
        <Modal title="Choice" isOpen={isOpen} onClose={onClose} footer={submitButton}>
            <div className="choice-modal">
                <div className="choice-modal__inline-form">
                    <TextInput
                        id="modal-condition-id"
                        label="Condition ID"
                        value={conditionID ?? ''}
                        onChange={(value) => {
                            setConditionID(value ?? null);
                        }}
                    />
                    <TextInput
                        id="modal-condition-next-dialogue-id"
                        label="Next dialogue ID"
                        value={nextDialogueID ?? ''}
                        onChange={(value) => {
                            setNextDialogueID(value ?? null);
                        }}
                    />
                    <CheckboxInput
                        id="modal-condition-next-dialogue-add-history"
                        label={'Add to history'}
                        value={addToHistory}
                        onChange={(value) => setAddToHistory(value)}
                    />
                </div>
                <TextInput
                    id="modal-condition-short-description"
                    label="Short description"
                    value={shortDescription ?? ''}
                    onChange={(value) => {
                        setShortDescription(value ?? null);
                    }}
                />
                <h3>Condition Outcomes</h3>
                <div className="choice-modal__condition-outcome-form">
                    <Dropdown
                        id="modal-condition-outcome-add-remove"
                        label="Add/Remove"
                        options={conditionOutcomeOptions}
                        defaultValue={addingOrRemoving ?? ''}
                        onOptionSelect={(value) => setAddingOrRemoving(value)}
                    />
                    <TextInput
                        id="modal-condition-outcome-id"
                        label="ID"
                        placeholder="ID"
                        value={conditionOutcomeID ?? ''}
                        onChange={(value) => {
                            setConditionOutcomeID(value ?? null);
                        }}
                    />
                    <TextInput
                        id="modal-condition-outcome-naem"
                        label="Name"
                        placeholder="Name"
                        value={conditionName ?? ''}
                        onChange={(value) => {
                            setConditionName(value ?? null);
                        }}
                    />
                    <div className="choice-modal__condition-outcome-form-button">
                        <Button onClick={addConditionOutcome}>Add</Button>
                    </div>
                </div>
                <hr className="divider" />
                <div className="choice-modal__condition-outcome">
                    <div className="choice-modal__condition-outcome-header">Adding/Removing</div>
                    <div className="choice-modal__condition-outcome-header">ID</div>
                    <div className="choice-modal__condition-outcome-header">Name</div>
                    <div />
                    {conditionOutcomes.map((outcome) => (
                        <Fragment key={outcome.id}>
                            <div>{outcome.addingOrRemoving}</div>
                            <div>{outcome.id}</div>
                            <div>{outcome.conditionName}</div>
                            <div className="choice-modal__condition-outcome-actions">
                                <Button
                                    buttonTheme={ButtonTheme.Delete}
                                    onClick={() => deleteOutcome(outcome.id)}
                                >
                                    <Icon iconType={IconType.TRASH} />
                                </Button>
                            </div>
                        </Fragment>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
