import { useEffect, useRef, useState } from 'react';

import './skill-test-difficulty-modal.css';
import { Modal } from '../../../SharedComponents/Modal/Modal';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { ConditionOutcome, SkillTestDifficulty } from '../domain/types';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { Dropdown } from '../../../SharedComponents/Dropdown/Dropdown';
import { DescriptionCard } from '../../../SharedComponents/DescriptionCard/DescriptionCard';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

type Props = {
    isOpen: boolean;
    difficulty: SkillTestDifficulty | null;
    updateDifficulty: (difficulty: SkillTestDifficulty) => void;
    onClose: () => void;
};

const conditionOutcomeOptions = [
    { label: 'Adding', value: 'adding' },
    { label: 'Removing', value: 'removing' },
];

export const SkillTestDifficultyModal = (props: Props) => {
    const { isOpen, difficulty, updateDifficulty, onClose } = props;

    const inputRef = useRef<HTMLInputElement>(null);

    const [threshold, setThreshold] = useState<number | null>(difficulty?.threshold ?? null);
    const [conditionOutcomes, setConditionOutcomes] = useState<Array<ConditionOutcome>>(
        difficulty?.conditionOutcomes ?? [],
    );

    const [currentConditionID, setCurrentConditionID] = useState<string | null>(null);
    const [currentConditionName, setCurrentConditionName] = useState<string | null>(null);
    const [addingOrRemoving, setAddingOrRemoving] = useState<string>('adding');

    useEffect(() => {
        setThreshold(difficulty?.threshold ?? null);
        setConditionOutcomes(difficulty?.conditionOutcomes ?? []);
    }, [difficulty]);

    const onAddConditionOutcome = () => {
        if (!currentConditionID || !currentConditionName) {
            return;
        }

        setConditionOutcomes([
            ...conditionOutcomes,
            { id: currentConditionID, conditionName: currentConditionName, addingOrRemoving },
        ]);

        setCurrentConditionID(null);
        setCurrentConditionName(null);
        setAddingOrRemoving('adding');

        inputRef.current?.focus();
    };

    const deleteConditionOutcome = (outcomeID: string) => {
        const conditionOutcomesCopy = [...conditionOutcomes];
        const indexToDelete = conditionOutcomesCopy.findIndex(
            (outcome) => outcome.id === outcomeID,
        );

        if (indexToDelete === -1) {
            return;
        }

        conditionOutcomesCopy.splice(indexToDelete, 1);
        setConditionOutcomes(conditionOutcomesCopy);
    };

    const isSubmitEnabled =
        threshold === null || threshold === undefined || conditionOutcomes.length < 1;

    const onSubmit = () => {
        if (threshold === null || threshold === undefined || conditionOutcomes.length < 1) {
            return;
        }

        updateDifficulty({
            id: difficulty?.id ? difficulty.id : Math.trunc(Date.now() + Math.random()),
            threshold,
            conditionOutcomes,
        });
        setCurrentConditionID(null);
        setCurrentConditionName(null);
        setAddingOrRemoving('adding');
        onClose();
    };

    const submitButton = (
        <Button disabled={isSubmitEnabled} onClick={onSubmit}>
            Save difficulty
        </Button>
    );

    return (
        <Modal isOpen={isOpen} title="Difficulty" onClose={onClose} footer={submitButton}>
            <DescriptionCard>
                <p>
                    This modal allows you to add a Difficulty to your Skill Test. A Difficulty has a
                    "Threshold" which represents the value that the character must pass, and a
                    "Condition Outcome" which represents the Game Engine adding or removing a
                    condition from the game state.
                </p>
                <p>
                    For example, a Skill Test to climb a wall may add an "exhausted" condition to
                    the game state if the character does poorly.
                </p>
            </DescriptionCard>
            <div>
                <TextInput
                    id={'skill-test-difficulty-threshold-modal'}
                    placeholder="Condition threshold"
                    value={threshold ?? ''}
                    onChange={(value) => setThreshold(value ? Number(value) : null)}
                    numbersOnly
                />
            </div>
            <hr className="divider" />
            <div className="skill-test-difficulty-modal-outcome__form">
                <TextInput
                    id={'skill-test-difficulty-condition-id'}
                    placeholder="Condition ID"
                    value={currentConditionID ?? ''}
                    onChange={(value) => setCurrentConditionID(value ?? null)}
                    ref={inputRef}
                />
                <TextInput
                    id={'skill-test-difficulty-condition-name'}
                    placeholder="Condition name"
                    value={currentConditionName ?? ''}
                    onChange={(value) => setCurrentConditionName(value ?? null)}
                />
                <Dropdown
                    defaultValue="adding"
                    options={conditionOutcomeOptions}
                    onOptionSelect={(value) => setAddingOrRemoving(value)}
                />
                <Button onClick={onAddConditionOutcome}>Add condition outcome</Button>
            </div>
            <div>
                {conditionOutcomes.map((outcome) => (
                    <div
                        key={outcome.id}
                        className="skill-test-difficulty-modal__condition-outcome"
                    >
                        <div>
                            {outcome.addingOrRemoving +
                                ' : ' +
                                outcome.conditionName +
                                ' (' +
                                outcome.id +
                                ')'}
                        </div>
                        <div>
                            <Button
                                onClick={() => deleteConditionOutcome(outcome.id)}
                                buttonTheme={ButtonTheme.Delete}
                            >
                                <Icon iconType={IconType.TRASH} />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
};
