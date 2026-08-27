import { useCallback, useState } from 'react';

import { KingdomGenerationConfig, Kingdom } from '../domain/types';
import { convertApiCase } from '../../Common/convertApiCase';

export const useGenerateKingdom = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const createKingdom = useCallback(
        async (
            lobbyCode: string,
            authzToken: string,
            config: KingdomGenerationConfig,
            abortSignal?: AbortSignal,
        ): Promise<Kingdom | null> => {
            setIsLoading(true);
            setError(null);

            const payload = {
                name: config.name,
                width: config.width,
                height: config.height,
                authz_token: authzToken,
                lobby_code: lobbyCode,
            };

            try {
                const response = await fetch('/api/1/kingdoms/generate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    signal: abortSignal,
                });
                if (!response.ok) {
                    const data = await response.text();
                    const dataJson = convertApiCase<{ error: string }>(data);
                    throw new Error(dataJson?.error);
                }

                const data = await response.text();
                const dataJson = convertApiCase<Kingdom>(data);
                if (!dataJson) {
                    throw new Error('Invalid Kingdom response data');
                }

                return dataJson;
            } catch (error) {
                console.log(error);
                setError(error instanceof Error ? error.message : 'Unknown error occurred');

                return null;
            } finally {
                setIsLoading(false);
            }
        },
        [],
    );

    return { createKingdom, isLoading, error };
};
