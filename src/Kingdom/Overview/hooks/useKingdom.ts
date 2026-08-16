import { useEffect, useState, useCallback } from 'react';

import { Kingdom } from '../domain/types';

export const useKingdom = (id: number | null) => {
    const [kingdom, setKingdom] = useState<Kingdom | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchKingdom = useCallback((kingdomId: number, abortSignal?: AbortSignal) => {
        setIsLoading(true);
        setError(null);
        fetch(`/api/1/kingdoms/${kingdomId}`, { signal: abortSignal })
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`Failed to fetch Kingdom (Status: ${res.status})`);
                }
                return res.json();
            })
            .then((data) => {
                if (data && data.id) {
                    setKingdom(data);
                } else {
                    throw new Error('Invalid Kingdom response data');
                }
            })
            .catch((err) => {
                setError(err instanceof Error ? err.message : 'Unknown error occurred');
                setKingdom(null);
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        if (id !== null && !isNaN(id)) {
            fetchKingdom(id, controller.signal);
        } else {
            setKingdom(null);
        }

        return () => {
            controller.abort();
        };
    }, [id, fetchKingdom]);

    return { kingdom, isLoading, error, refetch: () => id && fetchKingdom(id) };
};
