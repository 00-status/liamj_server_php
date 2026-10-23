import { ReactElement, useState } from 'react';

import { Page } from '../../../SharedComponents/Page/Page';
import { JSONFileInput } from '../../../SharedComponents/FileInput/JSONFileInput';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { Card } from '../../../SharedComponents/Card/Card';
import { Formation } from '../../domain/formation/types';
import { MonsterCombatant } from '../../domain/Combatant';
import { dungeonCrawlerEditorRoutes } from '../domain';

import {
    createDefaultFormation,
    createDefaultMonsterCombatant,
    deserializeFormations,
} from './domain';
import { FormationGrid } from './components/FormationGrid';
import { CombatantEditor } from './components/CombatantEditor';
import './monster-formation-editor-page.css';

const MonsterFormationEditorPage = (): ReactElement => {
    const [formations, setFormations] = useState<Formation[]>([]);
    const [selectedFormationId, setSelectedFormationId] = useState<string | null>(null);
    const [selectedCombatantId, setSelectedCombatantId] = useState<string | null>(null);

    const handleFileLoad = (
        parsed: Array<{ [key: string]: unknown }> | { [key: string]: unknown },
    ) => {
        const loaded = deserializeFormations(parsed);
        setFormations(loaded);
        if (loaded.length > 0) {
            setSelectedFormationId(loaded[0].id);
            setSelectedCombatantId(
                loaded[0].combatants.length > 0 ? loaded[0].combatants[0].id : null,
            );
        } else {
            setSelectedFormationId(null);
            setSelectedCombatantId(null);
        }
    };

    const handleCreateFormation = () => {
        const newFormation = createDefaultFormation();
        setFormations((prev) => [...prev, newFormation]);
        setSelectedFormationId(newFormation.id);
        setSelectedCombatantId(newFormation.combatants[0]?.id ?? null);
    };

    const handleDeleteFormation = (formationId: string) => {
        setFormations((prev) => {
            const updated = prev.filter((f) => f.id !== formationId);
            if (selectedFormationId === formationId) {
                const nextFormation = updated.length > 0 ? updated[0] : null;
                setSelectedFormationId(nextFormation ? nextFormation.id : null);
                setSelectedCombatantId(
                    nextFormation && nextFormation.combatants.length > 0
                        ? nextFormation.combatants[0].id
                        : null,
                );
            }
            return updated;
        });
    };

    const handleExport = () => {
        const jsonString = JSON.stringify(formations, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'monster_formations.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const selectedFormation = formations.find((f) => f.id === selectedFormationId);

    const handleAddCombatantAt = (x: number, y: number) => {
        if (!selectedFormation) return;

        const newCombatant = createDefaultMonsterCombatant(
            { x, y },
            `Monster (${x}, ${y})`,
        );
        const updatedFormation: Formation = {
            ...selectedFormation,
            combatants: [...selectedFormation.combatants, newCombatant],
        };

        setFormations((prev) =>
            prev.map((f) => (f.id === updatedFormation.id ? updatedFormation : f)),
        );
        setSelectedCombatantId(newCombatant.id);
    };

    const handleUpdateCombatant = (updatedCombatant: MonsterCombatant) => {
        if (!selectedFormation) return;

        const updatedFormation: Formation = {
            ...selectedFormation,
            combatants: selectedFormation.combatants.map((c) =>
                c.id === updatedCombatant.id ? updatedCombatant : c,
            ),
        };

        setFormations((prev) =>
            prev.map((f) => (f.id === updatedFormation.id ? updatedFormation : f)),
        );
    };

    const handleDeleteCombatant = (combatantId: string) => {
        if (!selectedFormation) return;

        const updatedCombatants = selectedFormation.combatants.filter(
            (c) => c.id !== combatantId,
        );
        const updatedFormation: Formation = {
            ...selectedFormation,
            combatants: updatedCombatants,
        };

        setFormations((prev) =>
            prev.map((f) => (f.id === updatedFormation.id ? updatedFormation : f)),
        );
        if (selectedCombatantId === combatantId) {
            setSelectedCombatantId(
                updatedCombatants.length > 0 ? updatedCombatants[0].id : null,
            );
        }
    };

    const selectedCombatant = selectedFormation?.combatants.find(
        (c) => c.id === selectedCombatantId,
    ) as MonsterCombatant | undefined;

    return (
        <Page
            title="Dungeon Crawler Monster Formation Editor"
            routes={dungeonCrawlerEditorRoutes}
        >
            <div className="formation-editor-page">
                <div className="formation-editor-page__top-bar">
                    <div className="formation-editor-page__file-actions">
                        <JSONFileInput
                            id="formation-file-input"
                            name="Load Formations JSON"
                            onChange={handleFileLoad}
                        />
                    </div>
                    <Button onClick={handleExport} disabled={formations.length === 0}>
                        Export Formations JSON
                    </Button>
                </div>

                <div className="formation-editor-page__content">
                    <div className="formation-editor-page__sidebar">
                        <div className="formation-editor-page__sidebar-header">
                            <h2>Formations ({formations.length})</h2>
                            <Button onClick={handleCreateFormation}>Add Formation</Button>
                        </div>
                        <div className="formation-editor-page__list">
                            {formations.length === 0 ? (
                                <div className="formation-editor-page__empty">
                                    No formations loaded. Upload a file or add a new
                                    formation.
                                </div>
                            ) : (
                                formations.map((item, index) => {
                                    const isSelected = item.id === selectedFormationId;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`formation-editor-page__item-card ${
                                                isSelected
                                                    ? 'formation-editor-page__item-card--selected'
                                                    : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedFormationId(item.id);
                                                setSelectedCombatantId(
                                                    item.combatants.length > 0
                                                        ? item.combatants[0].id
                                                        : null,
                                                );
                                            }}
                                        >
                                            <Card
                                                title={`Formation #${index + 1} (${item.combatants.length} Monsters)`}
                                            >
                                                <div className="formation-editor-page__item-id">
                                                    ID: {item.id}
                                                </div>
                                            </Card>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="formation-editor-page__main-area">
                        {selectedFormation ? (
                            <>
                                <div className="formation-editor-page__main-header">
                                    <div>
                                        <h2>Edit Formation</h2>
                                        <span className="formation-editor-page__item-id">
                                            ID: {selectedFormation.id}
                                        </span>
                                    </div>
                                    <Button
                                        buttonTheme={ButtonTheme.Delete}
                                        onClick={() =>
                                            handleDeleteFormation(selectedFormation.id)
                                        }
                                    >
                                        Delete Formation
                                    </Button>
                                </div>

                                <FormationGrid
                                    combatants={
                                        selectedFormation.combatants as MonsterCombatant[]
                                    }
                                    selectedCombatantId={selectedCombatantId}
                                    onSelectCombatant={(id) => setSelectedCombatantId(id)}
                                    onAddCombatantAt={handleAddCombatantAt}
                                />

                                {selectedCombatant ? (
                                    <CombatantEditor
                                        key={selectedCombatant.id}
                                        combatant={selectedCombatant}
                                        onChange={handleUpdateCombatant}
                                        onDelete={handleDeleteCombatant}
                                    />
                                ) : (
                                    <div className="formation-editor-page__empty">
                                        Select a monster from the grid above to edit its
                                        stats or abilities.
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="formation-editor-page__empty">
                                Select or create a formation to edit.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default MonsterFormationEditorPage;
