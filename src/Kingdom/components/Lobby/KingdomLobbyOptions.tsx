import { useState } from 'react';

import './kingdom-lobby-options.css';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { useGenerateKingdom } from '../../hooks/useGenerateKingdom';
import { Button } from '../../../SharedComponents/Button/Button';
import { KingdomGenerationConfig } from '../../domain/types';

type Props = {
    lobbyCode: string;
    authzToken: string;
};

export const KingdomLobbyOptions = ({ lobbyCode, authzToken }: Props) => {
    const [formError, setFormError] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);
    const [width, setWidth] = useState<number | null>(null);
    const [height, setHeight] = useState<number | null>(null);

    const { createKingdom, isLoading, error } = useGenerateKingdom();

    const handleGenerateKingdom = () => {
        if ((!!width && width > 500) || (!!height && height > 500)) {
            setFormError('Kingdom width and height cannot be greater than 500!');
            return;
        }

        const config: KingdomGenerationConfig = {
            name: name ?? undefined,
            width: width ?? undefined,
            height: height ?? undefined,
        };

        createKingdom(lobbyCode, authzToken, config);
    };

    return (
        <div className="kingdom-lobby-options">
            <h3>Options</h3>
            <div className="kingdom-lobby-options__error">
                {error}
                {formError}
            </div>
            <div className="kingdom-lobby-options__form">
                <TextInput
                    label="Kingdom Name"
                    value={name ?? ''}
                    onChange={(value) => setName(value ?? null)}
                    placeholder="Camelot"
                />
                <TextInput
                    label="Width"
                    value={width ?? ''}
                    numbersOnly
                    onChange={(value) => setWidth(value ? Number(value) : null)}
                    placeholder="30"
                />
                <TextInput
                    label="Height"
                    value={height ?? ''}
                    numbersOnly
                    onChange={(value) => setHeight(value ? Number(value) : null)}
                    placeholder="30"
                />
            </div>
            <div className="kingdom-lobby-options__submit-button">
                <Button onClick={handleGenerateKingdom} disabled={isLoading}>
                    Create Game
                </Button>
            </div>
        </div>
    );
};
