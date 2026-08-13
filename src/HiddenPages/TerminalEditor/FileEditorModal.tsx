import { useState } from 'react';

import './file-editor-modal.css';
import { Modal } from '../../SharedComponents/Modal/Modal';
import { File } from '../../Terminal/hooks/files/useFiles';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button } from '../../SharedComponents/Button/Button';

type Props = {
    isOpen: boolean;
    onSubmit: (file: File) => void;
    onClose: () => void;
    file: File;
};

export const FileEditorModal = (props: Props) => {
    const { isOpen, onSubmit, onClose, file } = props;

    const [id] = useState(file.id);
    const [directoryId, setDirectoryId] = useState<number | null>(file.directoryId);
    const [name, setName] = useState(file.name);
    const [contents, setContents] = useState(file.contents);
    const [encryptionCode, setEncryptionCode] = useState(file.encryptionCode);
    const [creatorUserName, setCreatorUserName] = useState(file.creatorUserName);
    const [dateCreated, setDateCreated] = useState(file.dateCreated);
    const [dateModified, setDateModified] = useState(file.dateModified);

    const onSubmitForm = () => {
        if (!directoryId) {
            return;
        }

        const newFile: File = {
            id,
            directoryId,
            name,
            contents,
            encryptionCode,
            creatorUserName,
            dateCreated,
            dateModified,
        };

        onSubmit(newFile);
        onClose();
    };

    return (
        <Modal
            title={id + ' | ' + name}
            footer={<Button onClick={onSubmitForm}>Submit</Button>}
            isOpen={isOpen}
            onClose={onClose}
        >
            <div className="file-editor-modal">
                <div>
                    <TextInput
                        label="Directory ID"
                        value={directoryId || ''}
                        onChange={(value) => setDirectoryId(Number(value) || null)}
                    />
                    <TextInput
                        label="Name"
                        value={name}
                        onChange={(value) => setName(value || '')}
                    />
                </div>
                <div>
                    <textarea
                        className="file-editor-modal__text-area"
                        value={contents}
                        onChange={(value) => {
                            const newContentsValue = value.target.value;
                            setContents(newContentsValue);
                        }}
                    />
                </div>
                <TextInput
                    label="Encryption code"
                    value={encryptionCode}
                    onChange={(value) => setEncryptionCode(value || '')}
                />
                <TextInput
                    label="Creator user name"
                    value={creatorUserName}
                    onChange={(value) => setCreatorUserName(value || '')}
                />
                <TextInput
                    label="Date created"
                    value={dateCreated}
                    onChange={(value) => setDateCreated(value || '')}
                />
                <TextInput
                    label="Date modified"
                    value={dateModified}
                    onChange={(value) => setDateModified(value || '')}
                />
            </div>
        </Modal>
    );
};
