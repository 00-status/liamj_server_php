import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

import { useChannelEvents } from '../../hooks/useChannelEvents';
import { useKingdomPlayer } from '../../hooks/useKingdomPlayer';
import { KingdomPlayerDTO, LocalKingdomPlayer } from '../../domain/types';

type Props = {
    channel: Channel | null;
    lobbyCode: string;
    currentPlayer: LocalKingdomPlayer;
};

export const Lobby = ({ channel, lobbyCode, currentPlayer }: Props) => {
    // Generate Kingdom.
    //      Allow the player to change certain params of the Kingdom to be generated: width, height, and Name.
    //      Pressing the "Generate Kingdom" button will call the api/1/generate_kingdom API.

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
                    {players.map((player) => {
                        const isCurrentPlayer = player.name === currentPlayer.name;

                        return (
                            <li
                                className={isCurrentPlayer ? 'kingdom-lobby__list-item--bold' : ''}
                                key={player.id}
                            >
                                {player.name}
                            </li>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
