import { useCallback } from 'react';

type UseCreateServer = {
    createServer: (newServer: string) => void;
};

export const useCreateServer = (fetchServers: () => void): UseCreateServer => {
    const createServer = useCallback((newServerName: string) => {
        const newServer = {
            id: 0,
            name: newServerName,
        };
        const serverJson = JSON.stringify(newServer);

        fetch('/api/1/terminal_servers', {
            method: 'POST',
            body: serverJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json);
                fetchServers();
            });
    }, []);

    return { createServer };
};
