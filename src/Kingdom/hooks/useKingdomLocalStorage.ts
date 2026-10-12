import { useCallback, useMemo, useState } from 'react';

import { LocalKingdomPlayer } from '../domain/types';

const LOCAL_STORAGE_KEY = 'lobbyAuthzTokens';

export const useKingdomLocalStorage = () => {
    const [localKingdomPlayer, setLocalKingdomPlayer] = useState<Array<LocalKingdomPlayer>>(() => {
        const rawData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!rawData) {
            return [];
        }

        try {
            const lobbyAuthzTokensArray: Array<LocalKingdomPlayer> | null = JSON.parse(rawData);
            return lobbyAuthzTokensArray ?? [];
        } catch {
            return [];
        }
    });

    const localKingdomPlayerMap = useMemo(() => {
        return localKingdomPlayer.reduce<Record<string, LocalKingdomPlayer>>(
            (accumulator, lobbyAuthzToken) => {
                accumulator[lobbyAuthzToken.lobbyCode] = lobbyAuthzToken;
                return accumulator;
            },
            {},
        );
    }, [localKingdomPlayer]);

    const savePlayerToLocalStorage = useCallback((lobbyAuthzToken: LocalKingdomPlayer) => {
        setLocalKingdomPlayer((previousPlayers) => {
            const nextPlayers = [...previousPlayers, lobbyAuthzToken];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextPlayers));
            return nextPlayers;
        });
    }, []);

    const cullPlayersFromLocalStorage = useCallback(() => {
        setLocalKingdomPlayer((previousPlayers) => {
            const nowUTC = new Date().toISOString();
            const nextPlayers = previousPlayers.filter((token) => token.timeToDie >= nowUTC);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextPlayers));
            return nextPlayers;
        });
    }, []);

    return {
        localKingdomPlayerMap,
        savePlayerToLocalStorage,
        cullPlayersFromLocalStorage,
    };
};
