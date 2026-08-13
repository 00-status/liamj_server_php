import { useContext, useEffect, useState } from 'react';

import './directory-editor.css';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Directory } from '../../Terminal/hooks/directories/useDirectories';
import { Card } from '../../SharedComponents/Card/Card';
import { ToastMessageContext } from '../../SharedComponents/Toast/ToastMessageContext';
import { File, useFiles } from '../../Terminal/hooks/files/useFiles';
import { Loader } from '../../SharedComponents/Loader/Loader';
import { Icon } from '../../SharedComponents/Icon/Icon';
import { IconType } from '../../SharedComponents/Icon/domain';

import { FileEditorModal } from './FileEditorModal';

type Props = {
    directory: Directory;
    updateDirectory: (directory: Directory) => void;
};

export const DirectoryEditor = (props: Props) => {
    const { setMessageList } = useContext(ToastMessageContext);

    const { directory, updateDirectory } = props;

    const [serverId, setServerId] = useState<number | null>(directory.serverId);
    const [name, setName] = useState<string>(directory.name);
    const [dateCreated, setDateCreated] = useState<string>(directory.dateCreated);
    const [parentDirectory, setParentDirectory] = useState<number | null>(
        directory.parentDirectory,
    );
    const [subDirectories, setSubDirectories] = useState<Array<number>>(directory.subDirectories);

    const [currentFileName, setCurrentFileName] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { isLoadingFiles, files, fetchFiles, createFile, updateFile, deleteFile } = useFiles();

    useEffect(() => {
        fetchFiles(directory.id);
    }, [fetchFiles, directory]);

    useEffect(() => {
        setServerId(directory.serverId);
        setName(directory.name);
        setDateCreated(directory.dateCreated);
        setParentDirectory(directory.parentDirectory);
        setSubDirectories(directory.subDirectories);
    }, [setServerId, setName, setDateCreated, setParentDirectory, setSubDirectories, directory]);

    const onCreateFile = () => {
        const newFile: File = {
            id: 0,
            directoryId: directory.id,
            name: currentFileName,
            contents: '',
            encryptionCode: '',
            creatorUserName: '',
            dateCreated: new Date().toISOString(),
            dateModified: new Date().toISOString(),
        };

        setCurrentFileName('');
        createFile(newFile);
    };

    const onSave = () => {
        if (!serverId) {
            setMessageList((state) => [...state, { message: 'Error: Must set a server ID!' }]);

            return;
        }

        const newDirectory: Directory = {
            id: directory.id,
            serverId: serverId,
            name: name,
            dateCreated: dateCreated,
            parentDirectory: parentDirectory,
            subDirectories: subDirectories,
            files: directory.files,
        };

        updateDirectory(newDirectory);
    };

    const saveButton = <Button onClick={onSave}>Save Directory</Button>;

    return (
        <Card title={name} button={saveButton}>
            <div className="directory-editor">
                <TextInput
                    placeholder="server ID"
                    value={serverId || ''}
                    onChange={(value) => setServerId(value ? Number(value) : null)}
                />
                <TextInput
                    placeholder="name"
                    value={name}
                    onChange={(value) => setName(value || '')}
                />
                <TextInput
                    placeholder="date created: 2024-01-01 00:00:00"
                    value={dateCreated}
                    onChange={(value) => setDateCreated(value || '')}
                />
                <TextInput
                    placeholder="parent directory ID"
                    value={parentDirectory || ''}
                    onChange={(value) => setParentDirectory(value ? Number(value) : null)}
                />
                <div>
                    {subDirectories.map((directoryId: number) => (
                        <div key={directoryId}>{directoryId}</div>
                    ))}
                </div>
                <hr className="divider" />
                <div>
                    Files
                    <div className="directory-editor__inline-form">
                        <TextInput
                            placeholder="file name"
                            value={currentFileName}
                            onChange={(value) => setCurrentFileName(value || '')}
                        />
                        <Button onClick={onCreateFile}>
                            <Icon iconType={IconType.PLUS} />
                        </Button>
                    </div>
                    {isLoadingFiles ? (
                        <Loader />
                    ) : (
                        files.map((file) => (
                            <div className="directory-editor__file-item" key={file.id}>
                                {file.name}
                                <div className="directory-editor__file-item-buttons">
                                    <Button onClick={() => setSelectedFile(file)}>
                                        <Icon iconType={IconType.PENCIL} />
                                    </Button>
                                    <Button
                                        buttonTheme={ButtonTheme.Delete}
                                        onClick={() => deleteFile(file.directoryId, file.id)}
                                    >
                                        <Icon iconType={IconType.TRASH} />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
            {selectedFile && (
                <FileEditorModal
                    file={selectedFile}
                    onSubmit={updateFile}
                    isOpen={!!selectedFile}
                    onClose={() => setSelectedFile(null)}
                />
            )}
        </Card>
    );
};
