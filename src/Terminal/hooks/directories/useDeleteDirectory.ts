import { useCallback, useState } from 'react';

type UseDeleteDirectory = {
    isDeleting: boolean;
    deleteDirectory: (serverID: number, directoryID: number) => void;
};

export const useDeleteDirectory = (fetchDirectories: (id: number) => void): UseDeleteDirectory => {
    const [isDeleting, setIsDeleting] = useState(false);

    const deleteDirectory = useCallback((serverID: number, DirectoryID: number) => {
        setIsDeleting(true);
        fetch('/api/1/terminal_directories/' + DirectoryID, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                fetchDirectories(serverID);
            })
            .finally(() => setIsDeleting(false));
    }, []);

    return { isDeleting, deleteDirectory };
};
