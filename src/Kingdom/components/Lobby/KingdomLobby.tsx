import { Channel } from 'pusher-js';
import { useEffect, useState } from 'react';

import './kingdom-lobby.css';
import { useChannelEvents } from '../../hooks/useChannelEvents';
import { useKingdomPlayer } from '../../hooks/useKingdomPlayer';
import { KingdomPlayerDTO, LocalKingdomPlayer } from '../../domain/types';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';
import { Page } from '../../../SharedComponents/Page/Page';

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
        'lobby-players-updated': (lobbyPlayersUpdated) => {
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
        <Page title="Kingdom Lobby" routes={[]}>
            <div className="kingdom-lobby">
                <div>
                    <h2>Players | {lobbyCode}</h2>
                    <ul>
                        {players.map((player) => {
                            const isCurrentPlayer = player.name === currentPlayer.name;

                            return (
                                <li
                                    className={
                                        isCurrentPlayer ? 'kingdom-lobby__list-item--bold' : ''
                                    }
                                    key={player.id}
                                >
                                    {player.name}
                                    {player.isLeader ? <Icon iconType={IconType.TAUNT} /> : ''}
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {currentPlayer.isLeader && (
                    <KingdomLobbyOptions
                        lobbyCode={lobbyCode}
                        authzToken={currentPlayer.authzToken}
                    />
                )}
            </div>
        </Page>
    );
};
