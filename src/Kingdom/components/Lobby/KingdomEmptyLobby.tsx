import { useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import './kingdom-empty-lobby.css';
import { Page } from '../../../SharedComponents/Page/Page';
import { Card } from '../../../SharedComponents/Card/Card';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { Button } from '../../../SharedComponents/Button/Button';
import { useKingdomLobby } from '../../hooks/useKingdomLobby';
import { useKingdomPlayer } from '../../hooks/useKingdomPlayer';
import { LobbyAuthzToken } from '../../domain/types';

type Props = {
    setCurrentLobbyCode: Dispatch<SetStateAction<string | null>>;
    lobbyAuthzTokenMap: Record<string, LobbyAuthzToken | null>;
    saveAuthzTokenToLocalStorage: (arg: LobbyAuthzToken) => void;
    joinWebSocketLobby: () => void;
};

export const KingdomEmptyLobby = ({
    setCurrentLobbyCode,
    lobbyAuthzTokenMap,
    saveAuthzTokenToLocalStorage,
    joinWebSocketLobby,
}: Props) => {
    const navigate = useNavigate();
    const [newLobbyCode, setNewLobbyCode] = useState<string>('');
    const [kingdomId, setKingdomId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { createLobby, isLoading: isLobbyLoading, error: lobbyApiError } = useKingdomLobby();
    const { createPlayer, isLoading: isPlayerLoading, error: playerApiError } = useKingdomPlayer();

    const handleCreateLobby = async () => {
        const lobby = await createLobby();

        if (!lobby) {
            return;
        }

        setNewLobbyCode(lobby.lobbyCode);

        const player = await createPlayer();

        if (!player) {
            return;
        }

        const now = new Date();
        now.setHours(now.getHours() + 3);
        const nowUTCString = now.toISOString();
        const lobbyAuthzToken: LobbyAuthzToken = {
            lobbyCode: lobby.lobbyCode,
            authzToken: player.authorizationToken,
            timeToDie: nowUTCString,
        };

        saveAuthzTokenToLocalStorage(lobbyAuthzToken);
    };

    const handleJoinLobby = async () => {
        if (newLobbyCode.trim().length !== 5) {
            setError('Lobby Code must be exactly 5 characters long.');
            return;
        }

        const lobbyAuthzToken = lobbyAuthzTokenMap[newLobbyCode];

        if (!lobbyAuthzToken) {
            const player = await createPlayer();

            if (!player) {
                return;
            }

            // Set authzToken for this lobby.
        }

        joinWebSocketLobby();

        // If an authzToken exists for the given lobbyCode
        //      Call POST /api/1/lobby/authz with the lobby code.
        //          If the response is successful
        //              Update the time_to_die on the player's authzToken in localState.
        //          else
        //              render errorMessage
        // else
        //      Call POST /api/1/kingdom_player
        //          If the response is successful
        //               Set the player's authzToken in localState, along with an expiry time.
        //          else
        //               render an errorMessage

        setError(null);
        setNewLobbyCode('');
        setCurrentLobbyCode(newLobbyCode);
    };

    const handleLoadKingdom = () => {
        const idInt = parseInt(kingdomId.trim(), 10);
        if (isNaN(idInt) || idInt <= 0) {
            setError('Please enter a valid positive integer Kingdom ID.');
            return;
        }

        setError(null);
        navigate(`/unlisted/kingdom_overview?id=${idInt}`);
    };

    const isLoading = isLobbyLoading || isPlayerLoading;
    return (
        <Page title="Kingdom Lobby" routes={[]}>
            <div className="kingdom-empty-lobby">
                <Card
                    title="Lobby"
                    button={
                        <Button onClick={handleCreateLobby} disabled={isLoading}>
                            Create New Lobby
                        </Button>
                    }
                >
                    <div className="kingdom-empty-lobby__error">
                        <p>{error}</p>
                        <p>{lobbyApiError}</p>
                        <p>{playerApiError}</p>
                    </div>
                    <div className="kingdom-empty-lobby__form">
                        <div>
                            <h3>Join Lobby</h3>
                            <div className="kingdom-empty-lobby__form-item">
                                <TextInput
                                    value={newLobbyCode}
                                    onChange={(value) => setNewLobbyCode(value || '')}
                                    placeholder="ADOMP"
                                />
                                <Button
                                    onClick={handleJoinLobby}
                                    disabled={!newLobbyCode || isLoading}
                                >
                                    Join Lobby
                                </Button>
                            </div>
                        </div>
                        <div>
                            <h3>Load Kingdom</h3>
                            <div className="kingdom-empty-lobby__form-item">
                                <TextInput
                                    value={kingdomId}
                                    onChange={(value) => setKingdomId(value || '')}
                                    placeholder="23"
                                />
                                <Button
                                    onClick={handleLoadKingdom}
                                    disabled={!kingdomId || isLoading}
                                >
                                    Load Kingdom
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </Page>
    );
};
