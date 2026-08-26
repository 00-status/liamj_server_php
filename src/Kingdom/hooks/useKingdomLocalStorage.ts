import { useCallback, useEffect, useState } from 'react';

import { LocalKingdomPlayer } from '../domain/types';

const LOCAL_STORAGE_KEY = 'lobbyAuthzTokens';

export const useKingdomLocalStorage = () => {
    const [localKingdomPlayer, setLocalKingdomPlayer] = useState<Array<LocalKingdomPlayer>>([]);
    const [localKingdomPlayerMap, setLocalKingdomPlayerMap] = useState<
        Record<string, LocalKingdomPlayer | null>
    >({});

    useEffect(() => {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const lobbyAuthzTokensArray: Array<LocalKingdomPlayer> | null = rawData
            ? JSON.parse(rawData)
            : null;

        if (!lobbyAuthzTokensArray) {
            return;
        }

        setLocalKingdomPlayer(lobbyAuthzTokensArray);
    }, []);

    useEffect(() => {
        const map = localKingdomPlayer.reduce<Record<string, LocalKingdomPlayer>>(
            (acc, lobbyAuthzToken) => {
                acc[lobbyAuthzToken.lobbyCode] = lobbyAuthzToken;
                return acc;
            },
            {},
        );

        setLocalKingdomPlayerMap(map);
    }, [localKingdomPlayer]);

    const savePlayerToLocalStorage = useCallback((lobbyAuthzToken: LocalKingdomPlayer) => {
        setLocalKingdomPlayer((prev) => {
            const next = [...prev, lobbyAuthzToken];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    const cullPlayersFromLocalStorage = useCallback(() => {
        setLocalKingdomPlayer((prev) => {
            const nowUTC = new Date().toISOString();
            const next = prev.filter((token) => token.timeToDie >= nowUTC);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next));
            return next;
        });
    }, []);

    return {
        localKingdomPlayerMap,
        savePlayerToLocalStorage,
        cullPlayersFromLocalStorage,
    };
};
