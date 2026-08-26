import { TextInput } from '../../../SharedComponents/TextInput/TextInput';

export const KingdomLobbyOptions = () => {
    return (
        <div>
            <h2>Options</h2>
            <div>
                <TextInput label="Kingdom Name" value={''} />
                <TextInput label="Width" value={''} numbersOnly />
                <TextInput label="Height" value={''} numbersOnly />
            </div>
        </div>
    );
};
