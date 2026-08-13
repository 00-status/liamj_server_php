import './character-list.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';
import { Character } from '../domain/types';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { ColorInput } from '../../../SharedComponents/ColorInput/ColorInput';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

type Props = {
    characters: Array<Character>;
    setCharacters: (characters: Array<Character>) => void;
};

export const CharacterList = (props: Props) => {
    const { characters, setCharacters } = props;

    const deleteCharacter = (index: number) => {
        const charactersCopy = [...characters];

        charactersCopy.splice(index, 1);

        setCharacters(charactersCopy);
    };

    const addNewCharacter = () => {
        const newCharacter = { id: crypto.randomUUID(), referenceID: '', name: '', nameColor: '' };

        setCharacters([...characters, newCharacter]);
    };

    const onCharacterChange = (newCharacter: Character, index: number) => {
        const charactersCopy = [...characters];

        charactersCopy[index] = newCharacter;

        setCharacters(charactersCopy);
    };

    return (
        <Card title="Characters" button={<Button onClick={addNewCharacter}>Add character</Button>}>
            <div className="character-list">
                {characters.map((character: Character, index: number) => {
                    return (
                        <div key={character.id} className="character-list__item">
                            <TextInput
                                id={character.referenceID}
                                placeholder="Reference ID"
                                value={character.referenceID}
                                onChange={(newValue) => {
                                    const newCharacter = {
                                        ...character,
                                        referenceID: newValue ?? '',
                                    };

                                    onCharacterChange(newCharacter, index);
                                }}
                            />
                            <TextInput
                                id={character.name}
                                placeholder="Character Name"
                                value={character.name}
                                onChange={(newValue) => {
                                    const newCharacter = { ...character, name: newValue ?? '' };

                                    onCharacterChange(newCharacter, index);
                                }}
                            />
                            <ColorInput
                                id="character-name-color"
                                value={character.nameColor}
                                onChange={(newValue) => {
                                    const newCharacter = {
                                        ...character,
                                        nameColor: newValue ?? '',
                                    };

                                    onCharacterChange(newCharacter, index);
                                }}
                            />
                            <Button
                                buttonTheme={ButtonTheme.Delete}
                                onClick={() => deleteCharacter(index)}
                            >
                                <Icon iconType={IconType.TRASH} />
                            </Button>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
