import { useEffect, useState } from 'react';

import { pusherClient, setAuthLobbyCode } from '../pusher';

import KingdomLobby from './components/Lobby/KingdomLobby';
import KingdomOverviewPage from './components/Overview/KingdomOverviewPage';

/**
 * KingdomPage | unlisted/kingdom, authenticates with websocket API.
 *      KingdomLobby | create or join lobby. Generate kingdom.
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
    // If we are NOT connected to the websocket server and we have not yet received a "kingdom-generated" event.
    //      Render the Lobby
    //          Create new Lobby
    //          Join a Lobby
    // If we receive a "kingdom-generated" event from ws server.
    //      Render KingdomOverview

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
