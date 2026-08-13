import { useCallback } from 'react';

import { File } from './useFiles';

type UseUpdateFile = {
    updateFile: (file: File) => void;
};

export const useUpdateFile = (fetchFiles: (directoryId: number) => void): UseUpdateFile => {
    const updateFile = useCallback((file: File) => {
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
            method: 'PUT',
            body: fileJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(() => fetchFiles(file.directoryId));
    }, []);

    return {
        updateFile,
    };
};
