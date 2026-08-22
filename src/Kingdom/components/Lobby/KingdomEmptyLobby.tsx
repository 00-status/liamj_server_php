import { useState, Dispatch, SetStateAction } from 'react';
import { useNavigate } from 'react-router-dom';

import { Page } from '../../../SharedComponents/Page/Page';
import { Card } from '../../../SharedComponents/Card/Card';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { Button } from '../../../SharedComponents/Button/Button';
import './kingdom-empty-lobby.css';
import { useKingdomLobby } from '../../hooks/useKingdomLobby';

type Props = {
    setCurrentLobbyCode: Dispatch<SetStateAction<string | null>>;
};

export const KingdomEmptyLobby = ({ setCurrentLobbyCode }: Props) => {
    const navigate = useNavigate();
    const [newLobbyCode, setNewLobbyCode] = useState<string>('');
    const [kingdomId, setKingdomId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const { createLobby, isLoading, error: apiError } = useKingdomLobby();

    // Creating a new lobby:
    //      Call POST api/1/lobby
    //          If successful
    //              Set the lobbyCode from the returned lobby.
    //              Set the player's authzToken for this lobby in localState, along with an expiry time.
    //          else
    //              Display errorMessage.

    const handleCreateLobby = async () => {
        const lobby = await createLobby();

        if (!lobby) {
            return;
        }

        setNewLobbyCode(lobby.lobbyCode);

        // Call the create endpoint for making a new player.
    };

    const handleJoinLobby = () => {
        if (newLobbyCode.trim().length !== 5) {
            setError('Lobby Code must be exactly 5 characters long.');
            return;
        }

        // If an authzToken exists for the given lobbyCode
        //      Call GET /api/1/kingdom_player with the lobby code.
        //          If the response is successful
        //              Set the player's authzToken in localState, along with a new expiry time.
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
                        <p>{apiError}</p>
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
                                <Button onClick={handleJoinLobby}>Join Lobby</Button>
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
                                <Button onClick={handleLoadKingdom} disabled={!!kingdomId}>
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
