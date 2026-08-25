import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

import { useChannelEvents } from '../../hooks/useChannelEvents';
import { useKingdomPlayer } from '../../hooks/useKingdomPlayer';
import { KingdomPlayerDTO } from '../../domain/types';

type Props = {
    channel: Channel | null;
    lobbyCode: string;
};

export const Lobby = ({ channel, lobbyCode }: Props) => {
    // Generate Kingdom.
    //      Allow the player to change certain params of the Kingdom to be generated: width, height, and Name.
    //      Pressing the "Generate Kingdom" button will call the api/1/generate_kingdom API.
    // List players.
    //      Fetch an initial list of players from the api/1/kingdom_players endpoint.
    //      Subscribe to socket-server "lobby-players-updated" event.
    //          When a player joins the channel
    //              Parse a new list of players from the event.
    //              Update the list of players with the new list.

    const [players, setPlayers] = useState<Array<KingdomPlayerDTO>>([]);

    const { fetchPlayers } = useKingdomPlayer();

    useChannelEvents(channel, {
        'lobby-players-updated': (data) => {
            console.log(data);
            setPlayers(data.players);
        },
    });

    useEffect(() => {
        fetchPlayers(lobbyCode).then((players) => {
            if (!players) {
                return;
            }

            setPlayers(players);
        });
    }, []);

    return (
        <div>
            <div>
                <h2>Players</h2>
                <div>
                    {players.map((player) => (
                        <li key={player.id}>{player.name}</li>
                    ))}
                </div>
            </div>
        </div>
    );
};
