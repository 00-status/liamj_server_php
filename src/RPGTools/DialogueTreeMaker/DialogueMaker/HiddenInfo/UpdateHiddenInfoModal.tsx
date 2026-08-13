import { useEffect, useRef, useState } from 'react';

import './update-hidden-info-modal.css';
import { HiddenInfo, HiddenInfoCondition } from '../../domain/types';
import { Modal } from '../../../../SharedComponents/Modal/Modal';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { DescriptionCard } from '../../../../SharedComponents/DescriptionCard/DescriptionCard';
import { Icon } from '../../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../../SharedComponents/Icon/domain';

type Props = {
    hiddenInfoToEdit: HiddenInfo | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (hiddenInfo: HiddenInfo) => void;
};

export const UpdateHiddenInfoModal = (props: Props) => {
    const { hiddenInfoToEdit, isOpen, onClose, onSave } = props;

    const [hiddenInfoID, setHiddenInfoID] = useState<string | null>(hiddenInfoToEdit?.id ?? null);
    const [conditions, setConditions] = useState<Array<HiddenInfoCondition>>(
        hiddenInfoToEdit?.conditionIDs ?? [],
    );
    const [description, setDescription] = useState<string | null>(
        hiddenInfoToEdit?.description ?? null,
    );

    const [newConditionID, setNewConditionID] = useState<string | null>(null);
    const [newConditionName, setNewConditionName] = useState<string | null>(null);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setHiddenInfoID(hiddenInfoToEdit?.id ?? null);
        setDescription(hiddenInfoToEdit?.description ?? '');
        setConditions(hiddenInfoToEdit?.conditionIDs ?? []);
    }, [hiddenInfoToEdit]);

    const addCondition = () => {
        if (!newConditionID || !newConditionName) {
            return;
        }

        setConditions([...conditions, { id: newConditionID, name: newConditionName }]);
        setNewConditionID(null);
        setNewConditionName(null);
        inputRef.current?.focus();
    };

    const removeCondition = (conditionID: string) => {
        const conditionsCopy = [...conditions];
        const conditionIdToDelete = conditionsCopy.findIndex(
            (condition) => condition.id === conditionID,
        );

        if (conditionIdToDelete === -1) {
            return;
        }

        conditionsCopy.splice(conditionIdToDelete, 1);
        setConditions(conditionsCopy);
    };

    const isSubmitDisabled = conditions.length <= 0 || !description;
    const saveHiddenInfo = () => {
        if (conditions.length <= 0 || !description) {
            return;
        }

        const newHiddenInfo: HiddenInfo = {
            id: hiddenInfoID ?? crypto.randomUUID(),
            conditionIDs: conditions,
            description,
        };

        onSave(newHiddenInfo);
        onClose();
    };

    return (
        <Modal
            title={'Add Hidden Info'}
            isOpen={isOpen}
            onClose={onClose}
            footer={
                <Button disabled={isSubmitDisabled} onClick={saveHiddenInfo}>
                    Save
                </Button>
            }
        >
            <div className="add-hidden-info-modal">
                <DescriptionCard>
                    This modal allows you to add and edit Hidden Info to your dialogue. Hidden Info
                    shows up when a certain condition exists in the game state. For example, if a
                    character has the "High Perception" condition, then perhaps they get more
                    information on a situation than they otherwise would have received.
                </DescriptionCard>
                <div className="add-hidden-info-modal__form">
                    <TextInput
                        ref={inputRef}
                        placeholder="Condition ID"
                        value={newConditionID ?? ''}
                        onChange={(newValue) => {
                            setNewConditionID(newValue ?? '');
                        }}
                    />
                    <TextInput
                        placeholder="Condition name"
                        value={newConditionName ?? ''}
                        onChange={(newValue) => {
                            setNewConditionName(newValue ?? '');
                        }}
                    />
                    <Button disabled={!(newConditionID && newConditionName)} onClick={addCondition}>
                        Add condition
                    </Button>
                </div>
                {conditions.map((condition) => {
                    return (
                        <div key={condition.id} className="hidden-info-item">
                            <div className="hidden-info-item__segment">
                                {condition.id} | {condition.name}
                            </div>
                            <div className="hidden-info-item__segment--actions">
                                <Button
                                    onClick={() => removeCondition(condition.id)}
                                    buttonTheme={ButtonTheme.Delete}
                                >
                                    <Icon iconType={IconType.TRASH} />
                                </Button>
                            </div>
                        </div>
                    );
                })}
                <textarea
                    className="add-hidden-info-modal__description"
                    value={description ?? ''}
                    onChange={(event) => {
                        const newValue = event.target.value ?? '';

                        setDescription(newValue);
                    }}
                />
            </div>
        </Modal>
    );
};
