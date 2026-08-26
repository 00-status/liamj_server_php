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
        const newLobbyAuthzTokenArray = [...localKingdomPlayer, lobbyAuthzToken];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLobbyAuthzTokenArray));
        setLocalKingdomPlayer(newLobbyAuthzTokenArray);
    }, []);

    const cullPlayersFromLocalStorage = useCallback(() => {
        const newLobbyAuthzTokenArray = localKingdomPlayer.filter((lobbyAuthzToken) => {
            const nowUTC = new Date().toISOString();
            if (lobbyAuthzToken.timeToDie < nowUTC) {
                return false;
            }

            return true;
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLobbyAuthzTokenArray));
        setLocalKingdomPlayer(newLobbyAuthzTokenArray);
    }, []);

    return {
        localKingdomPlayerMap,
        savePlayerToLocalStorage,
        cullPlayersFromLocalStorage,
    };
};
