import { useCallback, useState } from 'react';

import { convertApiCase } from '../../Common/convertApiCase';
import { KingdomPlayer } from '../domain/types';

export const useKingdomPlayer = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createPlayer = useCallback(
        async (abortSignal?: AbortSignal): Promise<KingdomPlayer | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/1/kingdom_player', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    signal: abortSignal,
                });
                if (!response.ok) {
                    throw new Error(`Failed to create Kingdom Player (Status: ${response.status})`);
                }

                const data = await response.text();
                const dataJson = convertApiCase<KingdomPlayer>(data);
                if (!dataJson) {
                    throw new Error('Invalid Kingdom Player response data');
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

    const fetchPlayer = useCallback(
        async (lobbyCode: string, abortSignal?: AbortSignal): Promise<KingdomPlayer | null> => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(`/api/1/kingdom_player/${lobbyCode}`, {
                    signal: abortSignal,
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch Player (Status: ${response.status})`);
                }

                const data = await response.text();
                const dataJson = convertApiCase<KingdomPlayer>(data);

                if (!dataJson) {
                    throw new Error('Invalid Player response data');
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

    return { createPlayer, fetchPlayer, isLoading, error };
};
