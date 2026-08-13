import { useCallback, useState } from 'react';

import { useCreateFile } from './useCreateFile';
import { usedeleteFile } from './useDeleteFile';
import { useUpdateFile } from './useUpdateFile';

export type File = {
    id: number;
    directoryId: number;
    name: string;
    contents: string;
    encryptionCode: string;
    creatorUserName: string;
    dateCreated: string;
    dateModified: string;
};

type UseFiles = {
    files: Array<File>;
    isLoadingFiles: boolean;
    fetchFiles: (directoryId: number) => void;
    createFile: (file: File) => void;
    updateFile: (file: File) => void;
    deleteFile: (directoryId: number, fileId: number) => void;
};

export const useFiles = (): UseFiles => {
    const [files, setFiles] = useState<Array<File>>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(false);

    const fetchFiles = useCallback(
        (directoryId: number) => {
            setIsLoadingFiles(true);
            fetch('/api/1/terminal_files?directory_id=' + directoryId)
                .then((response) => response.json())
                .then((json) => setFiles(json))
                .finally(() => setIsLoadingFiles(false));
        },
        [setFiles, setIsLoadingFiles],
    );

    const { createFile } = useCreateFile(fetchFiles);
    const { deleteFile } = usedeleteFile(fetchFiles);
    const { updateFile } = useUpdateFile(fetchFiles);

    return {
        files,
        isLoadingFiles,
        fetchFiles,
        createFile,
        updateFile,
        deleteFile,
    };
};
