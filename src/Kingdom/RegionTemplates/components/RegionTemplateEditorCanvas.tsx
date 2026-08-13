import React, { useMemo, useState } from 'react';
import './region-template-editor-canvas.css';

export interface RegionTemplateEditorCanvasProps {
    gridWidth: number;
    gridHeight: number;
    paintedTiles: { [key: string]: string };
    selectedTileType: string;
    onCellPaint: (x: number, y: number, type: string) => void;
}

export const RegionTemplateEditorCanvas: React.FC<RegionTemplateEditorCanvasProps> = ({
    gridWidth,
    gridHeight,
    paintedTiles,
    selectedTileType,
    onCellPaint,
}) => {
    const [isPainting, setIsPainting] = useState<boolean>(false);

    // Render cells in row-major order
    const cells = useMemo(() => {
        const result = [];
        for (let y = 0; y < gridHeight; y++) {
            for (let x = 0; x < gridWidth; x++) {
                const key = `${x}-${y}`;
                const type = paintedTiles[key] ?? 'Empty';
                result.push({ x, y, key, type });
            }
        }
        return result;
    }, [gridWidth, gridHeight, paintedTiles]);

    const handleCellAction = (x: number, y: number) => {
        onCellPaint(x, y, selectedTileType);
    };

    // Handle mouse events for painting
    const handleMouseDown = (x: number, y: number) => {
        setIsPainting(true);
        handleCellAction(x, y);
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (isPainting) {
            handleCellAction(x, y);
        }
    };

    const handleMouseUp = () => {
        setIsPainting(false);
    };

    return (
        <div
            className="region-template-editor-canvas"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <style>{`
                .region-template-editor-canvas__grid {
                    grid-template-columns: repeat(${gridWidth}, 32px);
                    grid-template-rows: repeat(${gridHeight}, 32px);
                }
            `}</style>
            <h3 className="region-template-editor-canvas__title">Interactive Painter Canvas</h3>
            <div className="region-template-editor-canvas__scroll">
                <div className="region-template-editor-canvas__grid">
                    {cells.map((cell) => (
                        <div
                            key={cell.key}
                            className={`region-template-editor-canvas__cell tile--${cell.type.toLowerCase()}`}
                            onMouseDown={() => handleMouseDown(cell.x, cell.y)}
                            onMouseEnter={() => handleMouseEnter(cell.x, cell.y)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
