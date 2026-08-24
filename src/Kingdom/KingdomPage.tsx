import { useCallback, useEffect, useState } from 'react';

import { pusherClient, setAuthLobbyCode } from '../pusher';

import { KingdomEmptyLobby } from './components/Lobby/KingdomEmptyLobby';
import KingdomOverviewPage from './components/Overview/KingdomOverviewPage';
import { useKingdomLocalStorage } from './hooks/useKingdomLocalStorage';

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
    const { lobbyAuthzTokenMap, saveAuthzTokenToLocalStorage, cullAuthzTokensFromLocalStorage } =
        useKingdomLocalStorage();

    useEffect(() => {
        cullAuthzTokensFromLocalStorage();
    }, []);

    // If any authzTokens exist in localStorage
    //      Cull the expired ones.
    //      set the authzTokenMap with the key being the lobby code.
    //
    // If joinWebSocketLobby is called
    //      Call the lobby/authz endpoint.
    //      If successful
    //          Set isAuthorizedWithLobby to true
    //      else
    //          Render error.
    //          Clear the lobby code.
    //
    //
    // If authorizedWithLobby is true AND we have received a "kingdom-generated" event
    //      Render KingdomOverview
    //          Call GET /api/1/kingdom endpoint for initial paint of Kingdom.
    //
    // If authorizedWithLobby is true BUT we have not received a "kingdom-generated" event.
    //      Render Lobby | Set Kingdom parameters, list players within the lobby.
    //
    // If authorizedWithLobby is false.
    //      Render EmptyLobby | Create new Lobby, join existing Lobby.
    //

    const [currentLobbyCode, setCurrentLobbyCode] = useState<string | null>(null);

    const joinWebSocketLobby = useCallback(() => {
        if (!currentLobbyCode) {
            return;
        }

        // Update auth param context before subscribing
        setAuthLobbyCode(currentLobbyCode);

        const channelName = `private-lobby-${currentLobbyCode}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind('player-joined', (data: unknown) => {
            console.log('Player joined:', data);
        });

        return () => {
            channel.unbind_all();
            pusherClient.unsubscribe(channelName);
            setAuthLobbyCode(null);
        };
    }, [currentLobbyCode]);

    if (!currentLobbyCode) {
        return (
            <KingdomEmptyLobby
                setCurrentLobbyCode={setCurrentLobbyCode}
                lobbyAuthzTokenMap={lobbyAuthzTokenMap}
                saveAuthzTokenToLocalStorage={saveAuthzTokenToLocalStorage}
                joinWebSocketLobby={joinWebSocketLobby}
            />
        );
    }

    return <KingdomOverviewPage />;
};

export default KingdomPage;
