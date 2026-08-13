import { useEffect, useState } from 'react';

import './terminal-editor-page.css';
import { Page } from '../../SharedComponents/Page/Page';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button } from '../../SharedComponents/Button/Button';
import { useServers } from '../../Terminal/hooks/server/useServers';
import { Directory, useDirectories } from '../../Terminal/hooks/directories/useDirectories';
import { Loader } from '../../SharedComponents/Loader/Loader';

import { TerminalListItem } from './TerminalListItem';
import { DirectoryEditor } from './DirectoryEditor';

const TerminalEditorPage = () => {
    const [newServerName, setNewServerName] = useState<string>('');
    const [selectedServerId, setSelectedServerId] = useState<number | null>(null);

    const [newDirectoryName, setNewDirectoryName] = useState<string>('');
    const [selectedDirectory, setSelectedDirectory] = useState<Directory | null>(null);

    const { servers, fetchServers, createServer, deleteServer } = useServers();
    const {
        isLoadingDirectories,
        directories,
        fetchDirectories,
        createDirectory,
        updateDirectory,
        deleteDirectory,
    } = useDirectories();

    useEffect(() => {
        fetchServers();
    }, []);

    useEffect(() => {
        if (selectedServerId) {
            fetchDirectories(selectedServerId);
        }
    }, [selectedServerId]);

    const onServerClick = (serverId: number) => {
        setSelectedDirectory(null);
        setSelectedServerId(serverId);
    };

    const onServerDelete = (serverId: number) => {
        if (serverId === selectedServerId) {
            setSelectedServerId(null);
        }

        deleteServer(serverId);
    };

    const onDirectoryClick = (directoryId: number) => {
        const newSelectedDirectory = directories.find((directory) => directory.id == directoryId);

        if (!newSelectedDirectory) {
            return;
        }

        setSelectedDirectory(newSelectedDirectory);
    };

    return (
        <Page title="Terminal Editor" routes={[]}>
            <div className="terminal-editor-page">
                <div className="terminal-editor-page__list">
                    <div className="terminal-editor-page__input">
                        <TextInput
                            placeholder="server name"
                            value={newServerName}
                            onChange={(value) => setNewServerName(value || '')}
                        />
                        <Button onClick={() => createServer(newServerName)}>Submit</Button>
                    </div>
                    {servers.map((server) => (
                        <TerminalListItem
                            key={server.id}
                            label={server.id + ' | ' + server.name}
                            onClick={() => onServerClick(server.id)}
                            onDelete={() => onServerDelete(server.id)}
                        />
                    ))}
                </div>
                <div className="terminal-editor-page__list">
                    {selectedServerId && (
                        <div className="terminal-editor-page__input">
                            <TextInput
                                placeholder="directory name"
                                value={newDirectoryName}
                                onChange={(value) => setNewDirectoryName(value || '')}
                            />
                            <Button
                                onClick={() => {
                                    if (selectedServerId && newDirectoryName) {
                                        const newDirectory: Directory = {
                                            id: 0,
                                            serverId: selectedServerId,
                                            name: newDirectoryName,
                                            dateCreated: new Date().toISOString(),
                                            parentDirectory: null,
                                            subDirectories: [],
                                            files: [],
                                        };
                                        createDirectory(newDirectory);
                                        setNewDirectoryName('');
                                    }
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    )}
                    {isLoadingDirectories ? (
                        <Loader />
                    ) : (
                        directories.map((directory) => (
                            <TerminalListItem
                                key={directory.id}
                                label={directory.id + ' | ' + directory.name}
                                onClick={() => onDirectoryClick(directory.id)}
                                onDelete={() => deleteDirectory(directory.serverId, directory.id)}
                            />
                        ))
                    )}
                </div>
                <div className="terminal-editor-page__directory-editor">
                    {selectedDirectory && (
                        <DirectoryEditor
                            directory={selectedDirectory}
                            updateDirectory={updateDirectory}
                        />
                    )}
                </div>
            </div>
        </Page>
    );
};

export default TerminalEditorPage;
