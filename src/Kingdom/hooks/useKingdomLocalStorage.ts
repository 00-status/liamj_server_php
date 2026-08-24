import { useCallback, useEffect, useState } from 'react';

import { LobbyAuthzToken } from '../domain/types';

const LOCAL_STORAGE_KEY = 'lobbyAuthzTokens';

export const useKingdomLocalStorage = () => {
    const [lobbyAuthzTokens, setLobbyAuthzTokens] = useState<Array<LobbyAuthzToken>>([]);
    const [lobbyAuthzTokenMap, setLobbyAuthzTokenMap] = useState<
        Record<string, LobbyAuthzToken | null>
    >({});

    useEffect(() => {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        const lobbyAuthzTokensArray: Array<LobbyAuthzToken> | null = rawData
            ? JSON.parse(rawData)
            : null;

        if (!lobbyAuthzTokensArray) {
            return;
        }

        setLobbyAuthzTokens(lobbyAuthzTokensArray);
    }, []);

    useEffect(() => {
        const map = lobbyAuthzTokens.reduce<Record<string, LobbyAuthzToken>>(
            (acc, lobbyAuthzToken) => {
                acc[lobbyAuthzToken.lobbyCode] = lobbyAuthzToken;
                return acc;
            },
            {},
        );

        setLobbyAuthzTokenMap(map);
    }, [lobbyAuthzTokens]);

    const saveAuthzTokenToLocalStorage = useCallback((lobbyAuthzToken: LobbyAuthzToken) => {
        const newLobbyAuthzTokenArray = [...lobbyAuthzTokens, lobbyAuthzToken];

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLobbyAuthzTokenArray));
        setLobbyAuthzTokens(newLobbyAuthzTokenArray);
    }, []);

    const cullAuthzTokensFromLocalStorage = useCallback(() => {
        const newLobbyAuthzTokenArray = lobbyAuthzTokens.filter((lobbyAuthzToken) => {
            const nowUTC = new Date().toISOString();
            if (lobbyAuthzToken.timeToDie < nowUTC) {
                return false;
            }

            return true;
        });

        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLobbyAuthzTokenArray));
        setLobbyAuthzTokens(newLobbyAuthzTokenArray);
    }, []);

    return { lobbyAuthzTokenMap, saveAuthzTokenToLocalStorage, cullAuthzTokensFromLocalStorage };
};
