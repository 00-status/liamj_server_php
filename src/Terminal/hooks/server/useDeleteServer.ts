import { useCallback } from 'react';

type UseCreateServer = {
    deleteServer: (id: number) => void;
};

export const useDeleteServer = (fetchServers: () => void): UseCreateServer => {
    const deleteServer = useCallback((serverID: number) => {
        fetch('/api/1/terminal_servers/' + serverID, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                fetchServers();
            });
    }, []);

    return { deleteServer };
};
