import { useEffect, useState } from 'react';

import { pusherClient, setAuthLobbyCode } from '../pusher';

import KingdomLobby from './components/Lobby/KingdomLobby';
import KingdomOverviewPage from './components/Overview/KingdomOverviewPage';

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
    // If any authzTokens exist in localStorage
    //      Cull the expired ones.
    //      set the authzTokenMap with the key being the lobby code.
    //
    // If the lobbyCode is set AND a matching authzToken exists
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
    //      Render lobby | Set Kingdom parameters, list players within the lobby.
    //
    // If authorizedWithLobby is false.
    //      Render EmptyLobby | Create new Lobby, join existing Lobby.
    //

    const [currentLobbyCode, setCurrentLobbyCode] = useState<string | null>(null);

    useEffect(() => {
        if (currentLobbyCode) {
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
        }

        return;
    }, [currentLobbyCode]);

    if (!currentLobbyCode) {
        return <KingdomLobby setCurrentLobbyCode={setCurrentLobbyCode} />;
    }

    return <KingdomOverviewPage />;
};

export default KingdomPage;
