import './character-maker.css';
import { Page } from '../../SharedComponents/Page/Page';
import { RPGRoutes } from '../domain';

import { CharacterList } from './Character/CharacterList';
import { useCharacters } from './useCharacters';

const CharacterMaker = () => {
    const { characters, setCharacters } = useCharacters();

    return (
        <Page title="RPG Tools" routes={RPGRoutes}>
            <div className="character-maker">
                <h1>Character Maker</h1>
                <div>
                    <CharacterList characters={characters} setCharacters={setCharacters} />
                </div>
            </div>
        </Page>
    );
};

export default CharacterMaker;
