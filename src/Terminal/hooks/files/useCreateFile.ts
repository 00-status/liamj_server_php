import { useCallback } from 'react';

import { File } from './useFiles';

type UseCreateFile = {
    createFile: (file: File) => void;
};

export const useCreateFile = (fetchFiles: (directoryId: number) => void): UseCreateFile => {
    const createFile = useCallback((file: File) => {
        const newFile = {
            id: file.id,
            directory_id: file.directoryId,
            name: file.name,
            contents: file.contents,
            encryption_code: file.encryptionCode,
            creator_user_name: file.creatorUserName,
            date_created: file.dateCreated,
            date_modified: file.dateModified,
        };

        const fileJson = JSON.stringify(newFile);

        fetch('/api/1/terminal_files', {
            method: 'POST',
            body: fileJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(() => fetchFiles(file.directoryId));
    }, []);

    return {
        createFile,
    };
};
