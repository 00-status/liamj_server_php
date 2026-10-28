import { useEffect, useState, useCallback } from 'react';

import type { Kingdom } from '../domain/types';

const fetchKingdomData = async (kingdomId: number, abortSignal?: AbortSignal): Promise<Kingdom> => {
    const response = await fetch(`/api/1/kingdoms/${kingdomId}`, { signal: abortSignal });
    if (!response.ok) {
        throw new Error(`Failed to fetch Kingdom (Status: ${response.status})`);
    }
    const data = await response.json();
    if (data && data.id) {
        return data;
    }
    throw new Error('Invalid Kingdom response data');
};

export const useKingdom = (id: number | null) => {
    const [previousId, setPreviousId] = useState<number | null>(id);
    const [kingdom, setKingdom] = useState<Kingdom | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(() => id !== null && !isNaN(id));
    const [error, setError] = useState<string | null>(null);

    if (id !== previousId) {
        setPreviousId(id);
        if (id !== null && !isNaN(id)) {
            setIsLoading(true);
            setError(null);
        } else {
            setKingdom(null);
            setIsLoading(false);
            setError(null);
        }
    }

    useEffect(() => {
        if (id === null || isNaN(id)) {
            return;
        }

        const controller = new AbortController();

        fetchKingdomData(id, controller.signal)
            .then((data) => {
                setKingdom(data);
                setError(null);
            })
            .catch((fetchError) => {
                if (controller.signal.aborted) {
                    return;
                }
                setError(
                    fetchError instanceof Error ? fetchError.message : 'Unknown error occurred',
                );
                setKingdom(null);
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => {
            controller.abort();
        };
    }, [id]);

    const refetch = useCallback(() => {
        if (id !== null && !isNaN(id)) {
            setIsLoading(true);
            setError(null);
            fetchKingdomData(id)
                .then((data) => {
                    setKingdom(data);
                    setError(null);
                })
                .catch((fetchError) => {
                    setError(
                        fetchError instanceof Error ? fetchError.message : 'Unknown error occurred',
                    );
                    setKingdom(null);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        }
    }, [id]);

    return { kingdom, isLoading, error, refetch };
};
