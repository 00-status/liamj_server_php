import { useCallback } from 'react';

import { Directory } from './useDirectories';

type UseUpdateDirectory = {
    updateDirectory: (directory: Directory) => void;
};

export const useUpdateDirectory = (
    fetchDirectories: (serverId: number) => void,
): UseUpdateDirectory => {
    const updateDirectory = useCallback((directory: Directory) => {
        const newDirectory = {
            id: directory.id,
            server_id: directory.serverId,
            name: directory.name,
            date_created: directory.dateCreated,
            parent_directory: directory.parentDirectory,
            sub_directories: directory.subDirectories,
            files: directory.files,
        };

        const directoryJson = JSON.stringify(newDirectory);

        fetch('/api/1/terminal_directories', {
            method: 'PUT',
            body: directoryJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(() => fetchDirectories(directory.serverId));
    }, []);

    return {
        updateDirectory,
    };
};
