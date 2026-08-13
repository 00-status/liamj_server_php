import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import './region-template-editor.css';
import { Page } from '../../SharedComponents/Page/Page';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';

import { useRegionTemplates, TileTemplate } from './hooks/useRegionTemplates';
import { RegionTemplateEditorSidebar } from './components/RegionTemplateEditorSidebar';
import { RegionTemplateEditorCanvas } from './components/RegionTemplateEditorCanvas';

export const RegionTemplateEditorPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editingIdStr = searchParams.get('id');
    const editingId = editingIdStr ? parseInt(editingIdStr, 10) : null;

    const { isLoading, templates, fetchTemplates, createTemplate, updateTemplate } =
        useRegionTemplates();

    const [templateName, setTemplateName] = useState<string>('');
    const [gridWidth, setGridWidth] = useState<number>(10);
    const [gridHeight, setGridHeight] = useState<number>(10);
    const [paintedTiles, setPaintedTiles] = useState<{ [key: string]: string }>({});
    const [selectedTileType, setSelectedTileType] = useState<string>('Prairie');

    useEffect(() => {
        fetchTemplates();
    }, [fetchTemplates]);

    useEffect(() => {
        if (editingId !== null && templates.length > 0) {
            const template = templates.find((template) => template.id === editingId);

            if (!template) {
                return;
            }

            setTemplateName(template.name);

            // Determine maximum coordinates to auto-resize canvas
            let maxX = 9; // default 10 columns
            let maxY = 9; // default 10 rows
            const loadedTiles: { [key: string]: string } = {};

            template.tile_templates.forEach((tile) => {
                loadedTiles[`${tile.x}-${tile.y}`] = tile.type;
                if (tile.x > maxX) maxX = tile.x;
                if (tile.y > maxY) maxY = tile.y;
            });

            setGridWidth(maxX + 1);
            setGridHeight(maxY + 1);
            setPaintedTiles(loadedTiles);
        }
    }, [editingId, templates]);

    const handleCellPaint = useCallback((x: number, y: number, type: string) => {
        setPaintedTiles((previous) => {
            const updated = { ...previous };
            const key = `${x}-${y}`;

            if (type === 'Empty') {
                delete updated[key];
            } else {
                updated[key] = type;
            }

            return updated;
        });
    }, []);

    const handleSubmit = () => {
        if (!templateName.trim()) {
            alert('Please provide a name for the Region Template!');
            return;
        }

        // Filter and construct TileTemplate items that are strictly within the dimensions and not "Empty"
        const finalTileTemplates: Array<TileTemplate> = [];

        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const key = `${x}-${y}`;
                const type = paintedTiles[key];

                if (type && type !== 'Empty') {
                    finalTileTemplates.push({
                        x,
                        y,
                        type,
                    });
                }
            }
        }

        const navigateBack = () => {
            navigate('/unlisted/region_templates');
        };

        if (editingId !== null) {
            updateTemplate(editingId, templateName, finalTileTemplates, navigateBack);
        } else {
            createTemplate(templateName, finalTileTemplates, navigateBack);
        }
    };

    const handleCancel = () => {
        navigate('/unlisted/region_templates');
    };

    const handleClear = () => {
        if (window.confirm('Are you sure you want to clear the entire canvas grid?')) {
            setPaintedTiles({});
        }
    };

    return (
        <Page
            title={editingId !== null ? `Edit Template #${editingId}` : 'Create Region Template'}
            routes={[]}
        >
            <div className="region-template-editor">
                <div className="region-template-editor__header">
                    <h1>Canvas Editor</h1>
                    <div>
                        <Button buttonTheme={ButtonTheme.Subtle} onClick={handleCancel}>
                            Back to Directory
                        </Button>
                    </div>
                </div>
                <div className="region-template-editor__container">
                    <RegionTemplateEditorSidebar
                        templateName={templateName}
                        setTemplateName={setTemplateName}
                        gridWidth={gridWidth}
                        setGridWidth={setGridWidth}
                        gridHeight={gridHeight}
                        setGridHeight={setGridHeight}
                        selectedTileType={selectedTileType}
                        setSelectedTileType={setSelectedTileType}
                        editingId={editingId}
                        isLoading={isLoading}
                        onClear={handleClear}
                        onSubmit={handleSubmit}
                    />

                    <RegionTemplateEditorCanvas
                        gridWidth={gridWidth}
                        gridHeight={gridHeight}
                        paintedTiles={paintedTiles}
                        selectedTileType={selectedTileType}
                        onCellPaint={handleCellPaint}
                    />
                </div>
            </div>
        </Page>
    );
};

export default RegionTemplateEditorPage;
