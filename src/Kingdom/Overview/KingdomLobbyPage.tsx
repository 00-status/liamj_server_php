import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../SharedComponents/Page/Page';
import { Card } from '../../SharedComponents/Card/Card';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button } from '../../SharedComponents/Button/Button';
import './kingdom-lobby-page.css';

export const KingdomLobbyPage = () => {
    const navigate = useNavigate();
    const [kingdomId, setKingdomId] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const handleLoadKingdom = (e: FormEvent) => {
        e.preventDefault();
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
            <div className="kingdom-lobby-page">
                <div className="kingdom-lobby-page__container">
                    <Card title="Load Kingdom">
                        <form className="kingdom-lobby-page__form" onSubmit={handleLoadKingdom}>
                            <p className="kingdom-lobby-page__description">
                                Enter the ID of an existing Kingdom to load the interactive map and
                                explore its regions.
                            </p>

                            <TextInput
                                label="Kingdom ID"
                                value={kingdomId}
                                placeholder="e.g. 1"
                                numbersOnly
                                onChange={(val) => {
                                    setKingdomId(val ?? '');
                                    setError(null);
                                }}
                            />

                            {error && <div className="kingdom-lobby-page__error">{error}</div>}

                            <div className="kingdom-lobby-page__actions">
                                <Button disabled={!kingdomId.trim()}>Load Kingdom</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </Page>
    );
};

export default KingdomLobbyPage;
