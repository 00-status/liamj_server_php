import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

import './kingdom-lobby.css';
import { useChannelEvents } from '../../hooks/useChannelEvents';
import { useKingdomPlayer } from '../../hooks/useKingdomPlayer';
import {
    KingdomPlayerDTO,
    LobbyPlayersUpdatedPayload,
    LocalKingdomPlayer,
} from '../../domain/types';
import { convertApiCase } from '../../../Common/convertApiCase';

import { KingdomLobbyOptions } from './KingdomLobbyOptions';

type Props = {
    channel: Channel | null;
    lobbyCode: string;
    currentPlayer: LocalKingdomPlayer;
};

export const KingdomLobby = ({ channel, lobbyCode, currentPlayer }: Props) => {
    const [players, setPlayers] = useState<Array<KingdomPlayerDTO>>([]);

    const { fetchPlayers } = useKingdomPlayer();

    useChannelEvents(channel, {
        'lobby-players-updated': (data) => {
            const dataString = JSON.stringify(data);
            const lobbyPlayersUpdated = convertApiCase<LobbyPlayersUpdatedPayload>(dataString);

            if (!lobbyPlayersUpdated) {
                return;
            }

            setPlayers(lobbyPlayersUpdated.players);
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
        <div className="kingdom-lobby">
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
            <KingdomLobbyOptions />
        </div>
    );
};
