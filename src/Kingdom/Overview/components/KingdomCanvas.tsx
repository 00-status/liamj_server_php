import {
    Dispatch,
    MouseEvent,
    RefObject,
    SetStateAction,
    TouchEvent,
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react';

import { Kingdom, Region, Tile } from '../domain/types';
import { TILE_COLORS } from '../domain/colors';

const TILE_SIZE = 32;
const GROW_FACTOR = 4; // The # of pixels to grow hovered tiles

type Props = {
    kingdom: Kingdom | null;
    containerRef: RefObject<HTMLDivElement | null>;
    setSelectedRegion: Dispatch<SetStateAction<Region | null>>;
};

export const KingdomCanvas = ({ kingdom, containerRef, setSelectedRegion }: Props) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // High performance interaction state in refs to avoid React re-renders on mousemove
    const cameraRef = useRef({
        offsetX: 0,
        offsetY: 0,
        isDragging: false,
        dragStart: { x: 0, y: 0 },
        dragStartOffset: { x: 0, y: 0 },
        hasMoved: false,
    });

    const hoveredRegionIdRef = useRef<number | null>(null);

    // Coordinate mapping and regions lookup for O(1) hover detection
    const tilesMap = useMemo(() => {
        const map: Record<string, { tile: Tile; region: Region }> = {};
        if (!kingdom) return map;

        kingdom.regions.forEach((region) => {
            region.tiles.forEach((tile) => {
                map[`${tile.x}-${tile.y}`] = { tile, region };
            });
        });
        return map;
    }, [kingdom]);

    const regionsMap = useMemo(() => {
        const map: Record<number, Region> = {};
        if (!kingdom) return map;

        kingdom.regions.forEach((region) => {
            map[region.id] = region;
        });
        return map;
    }, [kingdom]);

    // Center map on initial load or resize
    useEffect(() => {
        if (!kingdom || !canvasRef.current || !containerRef.current) {
            return;
        }

        const rect = containerRef.current.getBoundingClientRect();
        const mapWidth = kingdom.grid_width * TILE_SIZE;
        const mapHeight = kingdom.grid_height * TILE_SIZE;

        cameraRef.current.offsetX = Math.floor((rect.width - mapWidth) / 2);
        cameraRef.current.offsetY = Math.floor((rect.height - mapHeight) / 2);

        draw();
    }, [kingdom]);

    // Trigger canvas redraw on dependency updates (like selected/hover changes)
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas || !kingdom) {
            return;
        }

        const canvasContext = canvas.getContext('2d');
        if (!canvasContext) {
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const devicePixelRatio = window.devicePixelRatio || 1;

        // Sync canvas internal resolution with display size and device pixel ratio
        if (
            canvas.width !== rect.width * devicePixelRatio ||
            canvas.height !== rect.height * devicePixelRatio
        ) {
            canvas.width = rect.width * devicePixelRatio;
            canvas.height = rect.height * devicePixelRatio;
        }

        canvasContext.resetTransform();
        canvasContext.scale(devicePixelRatio, devicePixelRatio);

        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        canvasContext.fillStyle = '#222326';
        canvasContext.fillRect(0, 0, width, height);

        const { offsetX, offsetY } = cameraRef.current;

        // Draw grid boundaries (subtle border around the entire map)
        const mapWidth = kingdom.grid_width * TILE_SIZE;
        const mapHeight = kingdom.grid_height * TILE_SIZE;
        canvasContext.strokeStyle = '#333538';
        canvasContext.lineWidth = 2;
        canvasContext.strokeRect(offsetX, offsetY, mapWidth, mapHeight);

        // Calculate frustum culling boundaries (only draw visible tiles)
        const minX = Math.max(0, Math.floor(-offsetX / TILE_SIZE));
        const maxX = Math.min(kingdom.grid_width - 1, Math.ceil((width - offsetX) / TILE_SIZE));
        const minY = Math.max(0, Math.floor(-offsetY / TILE_SIZE));
        const maxY = Math.min(kingdom.grid_height - 1, Math.ceil((height - offsetY) / TILE_SIZE));

        const hoveredRegionId = hoveredRegionIdRef.current;

        // Phase 1: Draw standard (non-hovered) tiles in viewport
        for (let y = minY; y <= maxY; y++) {
            for (let x = minX; x <= maxX; x++) {
                const item = tilesMap[`${x}-${y}`];
                if (!item) continue;

                // Skip hovered region tiles for Phase 2
                if (hoveredRegionId !== null && item.region.id === hoveredRegionId) {
                    continue;
                }

                const tileX = offsetX + x * TILE_SIZE;
                const tileY = offsetY + y * TILE_SIZE;

                canvasContext.fillStyle = TILE_COLORS[item.tile.type] || '#444';
                canvasContext.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

                canvasContext.strokeStyle = 'rgba(0, 0, 0, 0.15)';
                canvasContext.lineWidth = 1;
                canvasContext.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }

        // Phase 2: Draw hovered region tiles last with grow & shadow effects
        if (hoveredRegionId !== null && regionsMap[hoveredRegionId]) {
            const hoveredRegion = regionsMap[hoveredRegionId];

            hoveredRegion.tiles.forEach((tile) => {
                const tileX = offsetX + tile.x * TILE_SIZE;
                const tileY = offsetY + tile.y * TILE_SIZE;

                // Culling bounds check in purely screen-space coordinates
                if (
                    tileX + TILE_SIZE + GROW_FACTOR < 0 || // Off the left edge of the canvas
                    tileX - GROW_FACTOR > width || // Off the right edge of the canvas
                    tileY + TILE_SIZE + GROW_FACTOR < 0 || // Off the top edge of the canvas
                    tileY - GROW_FACTOR > height // Off the bottom edge of the canvas
                ) {
                    return;
                }

                // Draw drop shadow
                canvasContext.fillStyle = 'rgba(0, 0, 0, 0.4)';
                canvasContext.fillRect(
                    tileX - GROW_FACTOR / 2 + 2,
                    tileY - GROW_FACTOR / 2 + 4,
                    TILE_SIZE + GROW_FACTOR,
                    TILE_SIZE + GROW_FACTOR,
                );

                // Draw the actual grown tile
                canvasContext.fillStyle = TILE_COLORS[tile.type] || '#444';
                canvasContext.fillRect(
                    tileX - GROW_FACTOR / 2,
                    tileY - GROW_FACTOR / 2,
                    TILE_SIZE + GROW_FACTOR,
                    TILE_SIZE + GROW_FACTOR,
                );
            });
        }
    }, [canvasRef, kingdom, tilesMap, regionsMap]);

    // Redraw on window resize
    useEffect(() => {
        const handleResize = () => {
            draw();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [draw]);

    // Setup rendering trigger
    useEffect(() => {
        if (kingdom) {
            draw();
        }
    }, [draw]);

    // Handle interactions
    const getMouseCoords = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        if ('touches' in e) {
            const touch = e.touches[0] || e.changedTouches[0];
            if (!touch) return { x: 0, y: 0 };
            return {
                x: touch.clientX - rect.left,
                y: touch.clientY - rect.top,
            };
        } else {
            return {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };
        }
    };

    const handleStart = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        // Prevent default touch gestures (pinch-zoom, scroll) while drawing/panning
        if (e.cancelable) {
            e.preventDefault();
        }

        const coords = getMouseCoords(e);
        cameraRef.current.isDragging = true;
        cameraRef.current.dragStart = coords;
        cameraRef.current.dragStartOffset = {
            x: cameraRef.current.offsetX,
            y: cameraRef.current.offsetY,
        };
        cameraRef.current.hasMoved = false;
    };

    const handleMove = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        const coords = getMouseCoords(e);
        const camera = cameraRef.current;

        if (camera.isDragging) {
            const dx = coords.x - camera.dragStart.x;
            const dy = coords.y - camera.dragStart.y;

            if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
                camera.hasMoved = true;
            }

            camera.offsetX = camera.dragStartOffset.x + dx;
            camera.offsetY = camera.dragStartOffset.y + dy;

            // Redraw map while panning
            draw();
        } else {
            // Hover logic when not dragging
            const tileX = Math.floor((coords.x - camera.offsetX) / TILE_SIZE);
            const tileY = Math.floor((coords.y - camera.offsetY) / TILE_SIZE);

            const item = tilesMap[`${tileX}-${tileY}`];
            const nextHoveredRegionId = item ? item.region.id : null;

            if (hoveredRegionIdRef.current !== nextHoveredRegionId) {
                hoveredRegionIdRef.current = nextHoveredRegionId;
                draw();
            }
        }
    };

    const handleEnd = (e: MouseEvent<HTMLCanvasElement> | TouchEvent<HTMLCanvasElement>) => {
        const camera = cameraRef.current;
        if (!camera.isDragging) return;

        camera.isDragging = false;

        // If it was a clean click/tap without dragging, select the region
        if (!camera.hasMoved) {
            const coords = getMouseCoords(e);
            const tileX = Math.floor((coords.x - camera.offsetX) / TILE_SIZE);
            const tileY = Math.floor((coords.y - camera.offsetY) / TILE_SIZE);

            const item = tilesMap[`${tileX}-${tileY}`];
            if (item) {
                setSelectedRegion(item.region);
            }
        }
    };

    const handleLeave = () => {
        cameraRef.current.isDragging = false;
        if (hoveredRegionIdRef.current !== null) {
            hoveredRegionIdRef.current = null;
            draw();
        }
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={handleStart}
            onMouseMove={handleMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleLeave}
            onTouchStart={handleStart}
            onTouchMove={handleMove}
            onTouchEnd={handleEnd}
        />
    );
};
