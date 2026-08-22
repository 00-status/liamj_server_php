import { useCallback, useState } from 'react';

import { KingdomLobby } from '../domain/types';
import { convertApiCase } from '../../Common/convertApiCase';

export const useKingdomLobby = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createLobby = useCallback(
        async (abortSignal?: AbortSignal): Promise<KingdomLobby | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/1/lobby', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: abortSignal,
                });
                if (!response.ok) {
                    throw new Error(`Failed to create Kingdom Lobby (Status: ${response.status})`);
                }

                const data = await response.text();
                const dataJson = convertApiCase<KingdomLobby>(data);
                if (!dataJson) {
                    throw new Error('Invalid Kingdom Lobby response data');
                }

                return dataJson;
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error occurred');

                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    const fetchLobby = useCallback(
        async (lobbyCode: string, abortSignal?: AbortSignal): Promise<KingdomLobby | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/1/lobby/${lobbyCode}`, { signal: abortSignal });

                if (!response.ok) {
                    throw new Error(`Failed to fetch Lobby (Status: ${response.status})`);
                }

                const data = await response.text();
                const dataJson = convertApiCase<KingdomLobby>(data);

                if (!dataJson) {
                    throw new Error('Invalid Lobby response data');
                }

                return dataJson;
            } catch (error) {
                setError(error instanceof Error ? error.message : 'Unknown error occurred');
                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    return { createLobby, fetchLobby, error, isLoading };
};
