import type { ReactElement} from 'react';
import { useState } from 'react';

import { Page } from '../../../SharedComponents/Page/Page';
import { JSONFileInput } from '../../../SharedComponents/FileInput/JSONFileInput';
import { Button } from '../../../SharedComponents/Button/Button';
import { Card } from '../../../SharedComponents/Card/Card';
import type { Equipment} from '../../domain/types';
import { EquipmentSlot } from '../../domain/types';
import { dungeonCrawlerEditorRoutes } from '../domain';

import { EquipmentEditor } from './components/EquipmentEditor';
import './dungeon-crawler-equipment-editor-page.css';

const DungeonCrawlerEquipmentEditorPage = (): ReactElement => {
    const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
    const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

    const handleFileLoad = (
        parsed: Array<{ [key: string]: unknown }> | { [key: string]: unknown },
    ) => {
        if (Array.isArray(parsed)) {
            const loaded = parsed as unknown as Equipment[];
            setEquipmentList(loaded);
            if (loaded.length > 0) {
                setSelectedEquipmentId(loaded[0].id);
            } else {
                setSelectedEquipmentId(null);
            }
        }
    };

    const handleCreateNew = () => {
        const newEquipment: Equipment = {
            id: crypto.randomUUID(),
            characterID: null,
            name: 'New Equipment',
            cost: 100,
            slot: EquipmentSlot.weapon,
            modifiers: [],
        };
        setEquipmentList((prev) => [...prev, newEquipment]);
        setSelectedEquipmentId(newEquipment.id);
    };

    const handleUpdateEquipment = (updatedEquipment: Equipment) => {
        setEquipmentList((prev) =>
            prev.map((item) => (item.id === updatedEquipment.id ? updatedEquipment : item)),
        );
    };

    const handleDeleteEquipment = (equipmentId: string) => {
        setEquipmentList((prev) => {
            const updated = prev.filter((item) => item.id !== equipmentId);
            if (selectedEquipmentId === equipmentId) {
                setSelectedEquipmentId(updated.length > 0 ? updated[0].id : null);
            }
            return updated;
        });
    };

    const handleExport = () => {
        const sortedList = [...equipmentList].sort((a, b) => {
            const slotComparison = a.slot.localeCompare(b.slot);
            if (slotComparison !== 0) {
                return slotComparison;
            }
            return a.name.localeCompare(b.name);
        });

        const jsonString = JSON.stringify(sortedList, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'equipment.json';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);
    };

    const selectedEquipment = equipmentList.find((item) => item.id === selectedEquipmentId);

    return (
        <Page title="Dungeon Crawler Equipment Editor" routes={dungeonCrawlerEditorRoutes}>
            <div className="equipment-editor-page">
                <div className="equipment-editor-page__top-bar">
                    <div className="equipment-editor-page__file-actions">
                        <JSONFileInput
                            id="equipment-file-input"
                            name="Load Equipment JSON"
                            onChange={handleFileLoad}
                        />
                    </div>
                    <Button
                        onClick={handleExport}
                        disabled={equipmentList.length === 0}
                    >
                        Export Equipment JSON
                    </Button>
                </div>

                <div className="equipment-editor-page__content">
                    <div className="equipment-editor-page__sidebar">
                        <div className="equipment-editor-page__sidebar-header">
                            <h2>Equipment List ({equipmentList.length})</h2>
                            <Button onClick={handleCreateNew}>Add Equipment</Button>
                        </div>
                        <div className="equipment-editor-page__list">
                            {equipmentList.length === 0 ? (
                                <div className="equipment-editor-page__empty">
                                    No equipment loaded. Upload a file or add a new item.
                                </div>
                            ) : (
                                equipmentList.map((item) => {
                                    const isSelected = item.id === selectedEquipmentId;
                                    return (
                                        <div
                                            key={item.id}
                                            className={`equipment-editor-page__item-card ${
                                                isSelected
                                                    ? 'equipment-editor-page__item-card--selected'
                                                    : ''
                                            }`}
                                            onClick={() => setSelectedEquipmentId(item.id)}
                                        >
                                            <Card title={item.name || 'Unnamed Equipment'}>
                                                <div className="equipment-editor-page__item-slot">
                                                    Slot: {item.slot}
                                                </div>
                                                <div className="equipment-editor-page__item-id">
                                                    ID: {item.id}
                                                </div>
                                            </Card>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    <div className="equipment-editor-page__main">
                        {selectedEquipment ? (
                            <EquipmentEditor
                                key={selectedEquipment.id}
                                equipment={selectedEquipment}
                                onChange={handleUpdateEquipment}
                                onDelete={handleDeleteEquipment}
                            />
                        ) : (
                            <div className="equipment-editor-page__empty">
                                Select or create an equipment item to edit.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default DungeonCrawlerEquipmentEditorPage;
