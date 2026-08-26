import { useCallback, useEffect, useState } from 'react';
import { Channel } from 'pusher-js';

import { pusherClient, setAuthLobbyCode, setAuthzToken } from '../pusher';

import { KingdomEmptyLobby } from './components/EmptyLobby/KingdomEmptyLobby';
import KingdomOverviewPage from './components/Overview/KingdomOverviewPage';
import { useKingdomLocalStorage } from './hooks/useKingdomLocalStorage';
import { Lobby } from './components/Lobby/Lobby';

/**
 * KingdomPage | unlisted/kingdom, authenticates with websocket API.
 *      KingdomEmptyLobby | create or join lobby.
 *      KingdomLobby | Generate kingdom, list players.
 *      KingdomOverview | GET initial paint of Kingdom. Orchestrate updates to kingdom.
 *           KingdomCanvas
 *           Sidebar
 *               RegionMenu
 *               ProjectMenu
 *               WarMenu
 *
 *
 */
const KingdomPage = () => {
    const [isAuthorizedWithLobby, setIsAuthorizedWithLobby] = useState<boolean>(false);
    const [channel, setChannel] = useState<Channel | null>(null);
    const [lobbyCode, setLobbyCode] = useState<string | null>(null);

    const { localKingdomPlayerMap, saveAuthzTokenToLocalStorage, cullAuthzTokensFromLocalStorage } =
        useKingdomLocalStorage();

    useEffect(() => {
        cullAuthzTokensFromLocalStorage();
    }, []);

    // If any authzTokens exist in localStorage ✅
    //      Cull the expired ones.
    //      set the authzTokenMap with the key being the lobby code.
    //
    // If joinWebSocketLobby is called ✅
    //      Call the lobby/authz endpoint.
    //      If successful
    //          Set isAuthorizedWithLobby to true
    //      else
    //          Render error.
    //
    //
    // If authorizedWithLobby is true AND we have received a "kingdom-generated" event
    //      Render KingdomOverview
    //          Call GET /api/1/kingdom endpoint for initial paint of Kingdom.
    //
    // If authorizedWithLobby is true BUT we have not received a "kingdom-generated" event.
    //      Render Lobby | Set Kingdom parameters 🟡, list players within the lobby. ✅
    //
    // If authorizedWithLobby is false. ✅
    //      Render EmptyLobby | Create new Lobby, join existing Lobby.
    //

    useEffect(() => {
        pusherClient.connection.bind('connected', () => console.log('Connected to pusher.'));
        pusherClient.connection.bind('failed', () =>
            console.log('Failed to connect to socket server!'),
        );
    }, []);

    const joinWebSocketLobby = useCallback((lobbyCode: string, authzToken: string) => {
        if (!lobbyCode || !authzToken) {
            return;
        }

        // Update auth param context before subscribing
        setAuthLobbyCode(lobbyCode);
        setAuthzToken(authzToken);

        const channelName = `private-lobby-${lobbyCode}`;
        const channel = pusherClient.subscribe(channelName);
        setChannel(channel);
        setLobbyCode(lobbyCode);
        setIsAuthorizedWithLobby(true);

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(channelName);
            setAuthLobbyCode(null);
        };
    }, []);

    const currentPlayer = lobbyCode ? localKingdomPlayerMap[lobbyCode] : null;

    if (!isAuthorizedWithLobby) {
        return (
            <KingdomEmptyLobby
                localKingdomPlayerMap={localKingdomPlayerMap}
                saveAuthzTokenToLocalStorage={saveAuthzTokenToLocalStorage}
                joinWebSocketLobby={joinWebSocketLobby}
            />
        );
    }

    if (channel && lobbyCode && currentPlayer) {
        return <Lobby channel={channel} lobbyCode={lobbyCode} currentPlayer={currentPlayer} />;
    }

    return <KingdomOverviewPage />;
};

export default KingdomPage;
