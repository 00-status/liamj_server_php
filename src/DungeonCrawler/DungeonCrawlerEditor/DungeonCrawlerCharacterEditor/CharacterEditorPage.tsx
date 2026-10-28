import type { ReactElement} from 'react';
import { useState } from 'react';

import { Page } from '../../../SharedComponents/Page/Page';
import { JSONFileInput } from '../../../SharedComponents/FileInput/JSONFileInput';
import { Button } from '../../../SharedComponents/Button/Button';
import { Card } from '../../../SharedComponents/Card/Card';
import type { Character } from '../../domain/types';
import { dungeonCrawlerEditorRoutes } from '../domain';
import { createDefaultMonsterCharacter } from '../DungeonCrawlerMonsterFormationEditor/domain';

import { CharacterEditor } from './components/CharacterEditor';
import './character-editor-page.css';

const CharacterEditorPage = (): ReactElement => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);

    const handleFileLoad = (
        parsed: Array<{ [key: string]: unknown }> | { [key: string]: unknown },
    ) => {
        if (Array.isArray(parsed)) {
            const loaded = parsed as unknown as Character[];
            setCharacters(loaded);
            if (loaded.length > 0) {
                setSelectedCharacterId(loaded[0].id);
            } else {
                setSelectedCharacterId(null);
            }
        }
    };

    const handleCreateCharacter = () => {
        const newChar = createDefaultMonsterCharacter(
            `New Monster ${characters.length + 1}`,
        );
        setCharacters((prev) => [...prev, newChar]);
        setSelectedCharacterId(newChar.id);
    };

    const handleUpdateCharacter = (updatedChar: Character) => {
        setCharacters((prev) =>
            prev.map((c) => (c.id === updatedChar.id ? updatedChar : c)),
        );
    };

    const handleDeleteCharacter = (charId: string) => {
        setCharacters((prev) => {
            const updated = prev.filter((c) => c.id !== charId);
            if (selectedCharacterId === charId) {
                setSelectedCharacterId(updated.length > 0 ? updated[0].id : null);
            }
            return updated;
        });
    };

    const handleExport = () => {
        const jsonString = JSON.stringify(characters, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'monster_characters.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const selectedCharacter = characters.find((c) => c.id === selectedCharacterId);

    return (
        <Page
            title="Dungeon Crawler Character Editor"
            routes={dungeonCrawlerEditorRoutes}
        >
            <div className="character-editor-page">
                <div className="character-editor-page__top-bar">
                    <div className="character-editor-page__file-actions">
                        <JSONFileInput
                            id="character-file-input"
                            name="Load Characters JSON"
                            onChange={handleFileLoad}
                        />
                    </div>
                    <Button onClick={handleExport} disabled={characters.length === 0}>
                        Export Characters JSON
                    </Button>
                </div>

                <div className="character-editor-page__content">
                    <div className="character-editor-page__sidebar">
                        <div className="character-editor-page__sidebar-header">
                            <h2>Characters ({characters.length})</h2>
                            <Button onClick={handleCreateCharacter}>Add Character</Button>
                        </div>
                        <div className="character-editor-page__list">
                            {characters.length === 0 ? (
                                <div className="character-editor-page__empty">
                                    No character templates loaded. Upload a file or add a
                                    new character.
                                </div>
                            ) : (
                                characters.map((item) => {
                                    const isSelected = item.id === selectedCharacterId;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`character-editor-page__item-card ${
                                                isSelected
                                                    ? 'character-editor-page__item-card--selected'
                                                    : ''
                                            }`}
                                            onClick={() => setSelectedCharacterId(item.id)}
                                        >
                                            <Card
                                                title={item.name || 'Unnamed Character'}
                                            >
                                                <div>Tier: {item.tier}</div>
                                                <div className="character-editor-page__item-id">
                                                    ID: {item.id}
                                                </div>
                                            </Card>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="character-editor-page__main">
                        {selectedCharacter ? (
                            <CharacterEditor
                                key={selectedCharacter.id}
                                character={selectedCharacter}
                                onChange={handleUpdateCharacter}
                                onDelete={handleDeleteCharacter}
                            />
                        ) : (
                            <div className="character-editor-page__empty">
                                Select or create a character template to edit.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default CharacterEditorPage;
