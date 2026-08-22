import { useCallback, useState } from 'react';

import { KingdomLobby } from '../domain/types';
import { convertApiCase } from '../../Common/convertApiCase';

export const useKingdomLobby = () => {
    const [lobby, setLobby] = useState<KingdomLobby | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createLobby = useCallback((abortSignal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        fetch('/api/1/lobby', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: abortSignal,
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to create Kingdom Lobby (Status: ${res.status})`);
                }
                return res.text();
            })
            .then((data) => {
                const dataJson = convertApiCase<KingdomLobby>(data);

                if (dataJson) {
                    setLobby(dataJson);
                } else {
                    throw new Error('Invalid Kingdom Lobby response data');
                }
            })
            .catch((error) => {
                setError(error instanceof Error ? error.message : 'Unknown error occurred');
                setLobby(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const fetchLobby = useCallback((lobbyCode: string, abortSignal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        fetch(`/api/1/lobby/${lobbyCode}`, { signal: abortSignal })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch Lobby (Status: ${res.status})`);
                }
                return res.text();
            })
            .then((data) => {
                const dataJson = convertApiCase<KingdomLobby>(data);

                if (dataJson) {
                    setLobby(dataJson);
                } else {
                    throw new Error('Invalid Lobby response data');
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
                setLobby(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return { lobby, createLobby, fetchLobby, error, isLoading };
};
