import { useCallback, useState } from 'react';

import { File } from '../files/useFiles';

import { useCreateDirectory } from './useCreateDirectory';
import { useDeleteDirectory } from './useDeleteDirectory';
import { useUpdateDirectory } from './useUpdateDirectory';

export type Directory = {
    id: number;
    serverId: number;
    name: string;
    dateCreated: string;
    parentDirectory: number | null;
    subDirectories: Array<number>;
    files: Array<File>;
};

type UseDirectories = {
    isLoadingDirectories: boolean;
    isDeletingDirectory: boolean;
    directories: Array<Directory>;
    fetchDirectories: (serverId: number) => void;
    createDirectory: (directory: Directory) => void;
    updateDirectory: (directory: Directory) => void;
    deleteDirectory: (serverId: number, DirectoryId: number) => void;
};

export const useDirectories = (): UseDirectories => {
    const [isLoadingDirectories, setIsLoadingDirectories] = useState(false);
    const [directories, setDirectories] = useState<Array<Directory>>([]);

    const fetchDirectories = useCallback(
        (serverId: number) => {
            setIsLoadingDirectories(true);
            fetch('/api/1/terminal_directories?server_id=' + serverId)
                .then((response) => response.json())
                .then((json) => setDirectories(json))
                .finally(() => setIsLoadingDirectories(false));
        },
        [setDirectories],
    );

    const { createDirectory } = useCreateDirectory(fetchDirectories);
    const { updateDirectory } = useUpdateDirectory(fetchDirectories);
    const { isDeleting, deleteDirectory } = useDeleteDirectory(fetchDirectories);

    return {
        isLoadingDirectories,
        isDeletingDirectory: isDeleting,
        directories,
        fetchDirectories,
        createDirectory,
        updateDirectory,
        deleteDirectory,
    };
};
