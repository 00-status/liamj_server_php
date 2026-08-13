import { useCallback } from 'react';

type UseDeleteFile = {
    deleteFile: (directoryId: number, fileId: number) => void;
};

export const usedeleteFile = (fetchFiles: (directoryId: number) => void): UseDeleteFile => {
    const deleteFile = useCallback((directoryId: number, fileId: number) => {
        fetch('/api/1/terminal_files/' + fileId, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(() => fetchFiles(directoryId));
    }, []);

    return {
        deleteFile,
    };
};
