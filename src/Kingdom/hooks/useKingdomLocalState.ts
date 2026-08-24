import { useCallback, useEffect, useState } from 'react';

import { LobbyAuthzToken } from '../domain/types';

export const useKingdomLocalState = () => {
    const [lobbyAuthzTokens, setLobbyAuthzTokens] = useState<Array<LobbyAuthzToken>>([]);
    const [lobbyAuthzTokenMap, setLobbyAuthzTokenMap] = useState<
        Record<string, LobbyAuthzToken | null>
    >({});

    useEffect(() => {
        const rawData = localStorage.getItem('lobbyAuthzTokens');
        const lobbyAuthzTokensArray: Array<LobbyAuthzToken> | null = rawData
            ? JSON.parse(rawData)
            : null;

        if (!lobbyAuthzTokensArray) {
            return;
        }

        const map = lobbyAuthzTokensArray.reduce<Record<string, LobbyAuthzToken>>(
            (acc, lobbyAuthzToken) => {
                acc[lobbyAuthzToken.lobbyCode] = lobbyAuthzToken;
                return acc;
            },
            {},
        );

        setLobbyAuthzTokens(lobbyAuthzTokensArray);
        setLobbyAuthzTokenMap(map);
    }, []);

    const saveAuthzTokenToLocalStorage = useCallback((lobbyAuthzToken: LobbyAuthzToken) => {
        const newLobbyAuthzTokenArray = [...lobbyAuthzTokens, lobbyAuthzToken];

        localStorage.setItem('lobbyAuthzTokens', JSON.stringify(newLobbyAuthzTokenArray));
    }, []);

    const cullAuthzTokensFromLocalStorage = useCallback(() => {
        const newLobbyAuthzTokenArray = lobbyAuthzTokens.filter((lobbyAuthzToken) => {
            const nowUTC = new Date().toISOString();
            if (lobbyAuthzToken.timeToDie < nowUTC) {
                return false;
            }

            return true;
        });

        localStorage.setItem('lobbyAuthzTokens', JSON.stringify(newLobbyAuthzTokenArray));
    }, []);

    return { lobbyAuthzTokenMap, saveAuthzTokenToLocalStorage, cullAuthzTokensFromLocalStorage };
};
