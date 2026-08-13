import { ReactElement, useState } from 'react';

import './dialogue-maker.css';
import { Dialogue, Choice, HiddenInfo } from '../domain/types';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { Card } from '../../../SharedComponents/Card/Card';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { Dropdown } from '../../../SharedComponents/Dropdown/Dropdown';
import { useCharacters } from '../../CharacterMaker';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

import { HiddenInfoItem } from './HiddenInfo/HiddenInfoItem';
import { UpdateHiddenInfoModal } from './HiddenInfo/UpdateHiddenInfoModal';
import { ChoicesTable } from './Choices/ChoicesTable';

type Props = {
    dialogue: Dialogue;
    onSave: (dialogue: Dialogue) => void;
    onDelete: () => void;
};

export const DialogueMaker = (props: Props): ReactElement => {
    const { dialogue, onSave, onDelete } = props;

    const [isAddHiddenInfoModalOpen, setIsAddHiddenInfoModalOpen] = useState<boolean>(false);
    const [hiddenInfoToEdit, setHiddenInfoToEdit] = useState<HiddenInfo | null>(null);

    const { characters } = useCharacters();

    const characterOptions = characters.map((character) => {
        return { label: character.name, value: character.id };
    });
    characterOptions.unshift({ label: '', value: 'default' });

    const deleteHiddenInfo = (hiddenInfoID: string) => {
        const hiddenInfoToDelete = dialogue.hiddenInfo.findIndex((hiddenInfo) => {
            return hiddenInfo.id === hiddenInfoID;
        });

        if (hiddenInfoToDelete === -1) {
            return;
        }

        const hiddenInfosCopy = [...dialogue.hiddenInfo];
        hiddenInfosCopy.splice(hiddenInfoToDelete, 1);

        onSave({ ...dialogue, hiddenInfo: hiddenInfosCopy });
    };

    return (
        <>
            <div className="dialogue-maker">
                <div className="dialogue-maker__title">
                    <h2>{dialogue.name}</h2>
                    <Button buttonTheme={ButtonTheme.Delete} onClick={onDelete}>
                        <Icon iconType={IconType.TRASH} />
                        Delete dialogue
                    </Button>
                </div>
                <div className="dialogue-maker__form">
                    <TextInput id="dialogue-id" label="Dialogue ID" value={dialogue.id} readonly />
                    <TextInput
                        id="dialogue-name"
                        label="Dialogue name"
                        value={dialogue.name}
                        onChange={(value) => {
                            onSave({ ...dialogue, name: value ?? '' });
                        }}
                    />
                    <Dropdown
                        id="character_dropdown"
                        label="Character"
                        defaultValue={dialogue.character ? dialogue.character.id : 'default'}
                        options={characterOptions}
                        onOptionSelect={(selectedOptionID: string) => {
                            const selectedCharacter = characters.find((character) => {
                                return character.id === selectedOptionID;
                            });

                            if (!selectedCharacter) {
                                return;
                            }

                            onSave({ ...dialogue, character: selectedCharacter });
                        }}
                    />
                </div>
                <div className="dialogue-maker__content">
                    <Card
                        title="Description"
                        button={
                            <Button onClick={() => setIsAddHiddenInfoModalOpen(true)}>
                                <Icon iconType={IconType.PLUS} />
                                Add hidden info
                            </Button>
                        }
                    >
                        <div className="dialogue-maker__description">
                            <label htmlFor="dialogue-description">Dialogue description</label>
                            <textarea
                                className="dialogue-maker__text-area"
                                id="dialogue-description"
                                value={dialogue.description}
                                onChange={(event) => {
                                    const newValue = event.target.value ?? '';

                                    onSave({ ...dialogue, description: newValue });
                                }}
                            />
                        </div>
                        <div className="dialogue-maker__description--hidden-info">
                            <div className="hidden-info-item">
                                <div className="hidden-info-item__segment">Conditions</div>
                                <div className="hidden-info-item__segment">Description</div>
                                <div className="hidden-info-item__segment" />
                            </div>
                            {dialogue.hiddenInfo.map((hiddenInfo) => {
                                return (
                                    <HiddenInfoItem
                                        key={hiddenInfo.id}
                                        hiddenInfo={hiddenInfo}
                                        onDelete={deleteHiddenInfo}
                                        onEdit={() => {
                                            setHiddenInfoToEdit(hiddenInfo);
                                            setIsAddHiddenInfoModalOpen(true);
                                        }}
                                    />
                                );
                            })}
                        </div>
                    </Card>
                    <ChoicesTable
                        choices={dialogue.choices}
                        onChange={(choices: Array<Choice>) => {
                            onSave({ ...dialogue, choices });
                        }}
                    />
                </div>
            </div>
            <UpdateHiddenInfoModal
                hiddenInfoToEdit={hiddenInfoToEdit}
                isOpen={isAddHiddenInfoModalOpen}
                onClose={() => {
                    setIsAddHiddenInfoModalOpen(false);
                    setHiddenInfoToEdit(null);
                }}
                onSave={(newHiddenInfo) => {
                    const hiddenInfosCopy = [...dialogue.hiddenInfo];
                    const hiddenInfoIDToReplace = dialogue.hiddenInfo.findIndex(
                        (existingHiddenInfo) => {
                            return existingHiddenInfo.id === newHiddenInfo.id;
                        },
                    );

                    if (hiddenInfoIDToReplace === -1) {
                        hiddenInfosCopy.push(newHiddenInfo);
                    } else {
                        hiddenInfosCopy[hiddenInfoIDToReplace] = newHiddenInfo;
                    }

                    onSave({ ...dialogue, hiddenInfo: hiddenInfosCopy });
                }}
            />
        </>
    );
};
