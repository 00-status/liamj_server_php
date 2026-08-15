import { useEffect, useMemo, useRef, useState, MouseEvent, TouchEvent } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { Page } from '../../SharedComponents/Page/Page';
import { Loader } from '../../SharedComponents/Loader/Loader';

import { useKingdom } from './hooks/useKingdom';
import { TILE_COLORS } from './domain/colors';
import { Region, Tile } from './domain/types';
import { calculateRegionTileCounts } from './domain/util';
import './kingdom-overview-page.css';
import { KingdomRegionOverlay } from './components/KingdomRegionOverlay';

const TILE_SIZE = 32;
const GROW_FACTOR = 4; // pixels to grow hovered tiles

export const KingdomOverviewPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const kingdomIdStr = searchParams.get('id');
    const kingdomId = kingdomIdStr ? parseInt(kingdomIdStr, 10) : null;

    const { kingdom, isLoading, error } = useKingdom(kingdomId);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    // Track active interactions
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

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
        if (!kingdom || !canvasRef.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const mapWidth = kingdom.grid_width * TILE_SIZE;
        const mapHeight = kingdom.grid_height * TILE_SIZE;

        cameraRef.current.offsetX = Math.floor((rect.width - mapWidth) / 2);
        cameraRef.current.offsetY = Math.floor((rect.height - mapHeight) / 2);

        draw();
    }, [kingdom]);

    // Trigger canvas redraw on dependency updates (like selected/hover changes)
    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas || !kingdom) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        // Sync canvas internal resolution with display size and device pixel ratio
        if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
        }

        ctx.resetTransform();
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // Clear canvas
        ctx.fillStyle = '#222326';
        ctx.fillRect(0, 0, width, height);

        const { offsetX, offsetY } = cameraRef.current;

        // Draw grid boundaries (subtle border around the entire map)
        const mapWidth = kingdom.grid_width * TILE_SIZE;
        const mapHeight = kingdom.grid_height * TILE_SIZE;
        ctx.strokeStyle = '#333538';
        ctx.lineWidth = 2;
        ctx.strokeRect(offsetX, offsetY, mapWidth, mapHeight);

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

                ctx.fillStyle = TILE_COLORS[item.tile.type] || '#444';
                ctx.fillRect(tileX, tileY, TILE_SIZE, TILE_SIZE);

                ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
                ctx.lineWidth = 1;
                ctx.strokeRect(tileX, tileY, TILE_SIZE, TILE_SIZE);
            }
        }

        // Phase 2: Draw hovered region tiles last with grow & shadow effects
        if (hoveredRegionId !== null && regionsMap[hoveredRegionId]) {
            const hoveredRegion = regionsMap[hoveredRegionId];

            hoveredRegion.tiles.forEach((tile) => {
                const tileX = offsetX + tile.x * TILE_SIZE;
                const tileY = offsetY + tile.y * TILE_SIZE;

                // Frustum cull hovered tiles too, to be completely safe
                if (
                    tileX + TILE_SIZE + GROW_FACTOR < offsetX ||
                    tileX - GROW_FACTOR > offsetX + width ||
                    tileY + TILE_SIZE + GROW_FACTOR < offsetY ||
                    tileY - GROW_FACTOR > offsetY + height
                ) {
                    return;
                }

                // Draw drop shadow manually (high performance, highly compatible across platforms)
                ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.fillRect(
                    tileX - GROW_FACTOR / 2 + 2,
                    tileY - GROW_FACTOR / 2 + 4,
                    TILE_SIZE + GROW_FACTOR,
                    TILE_SIZE + GROW_FACTOR,
                );

                // Draw the actual grown tile
                ctx.fillStyle = TILE_COLORS[tile.type] || '#444';
                ctx.fillRect(
                    tileX - GROW_FACTOR / 2,
                    tileY - GROW_FACTOR / 2,
                    TILE_SIZE + GROW_FACTOR,
                    TILE_SIZE + GROW_FACTOR,
                );

                // Draw highlighted white stroke border
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(
                    tileX - GROW_FACTOR / 2,
                    tileY - GROW_FACTOR / 2,
                    TILE_SIZE + GROW_FACTOR,
                    TILE_SIZE + GROW_FACTOR,
                );
            });
        }
    };

    // Redraw on window resize
    useEffect(() => {
        const handleResize = () => {
            draw();
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [kingdom, tilesMap, regionsMap]);

    // Setup rendering trigger
    useEffect(() => {
        if (kingdom) {
            draw();
        }
    }, [kingdom, tilesMap, regionsMap]);

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

    // Calculate totals of selected region
    const regionStats = useMemo(() => {
        if (!selectedRegion) return null;
        return calculateRegionTileCounts(selectedRegion.tiles);
    }, [selectedRegion]);

    // Back to Lobby button
    const handleBackToLobby = () => {
        navigate('/unlisted/kingdom_lobby');
    };

    if (isLoading) {
        return (
            <Page title="Kingdom Overview" routes={[]}>
                <div className="kingdom-overview-page kingdom-overview-page--loading">
                    <Loader />
                    <p>Loading interactive map...</p>
                </div>
            </Page>
        );
    }

    if (error || !kingdomId) {
        return (
            <Page title="Kingdom Overview" routes={[]}>
                <div className="kingdom-overview-page kingdom-overview-page--error">
                    <div className="kingdom-overview-page__error-card">
                        <h2>Error Loading Kingdom</h2>
                        <p>{error || 'No valid Kingdom ID was specified.'}</p>
                        <button className="custom-button" onClick={handleBackToLobby}>
                            Return to Lobby
                        </button>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page title={kingdom ? `Kingdom: ${kingdom.name}` : 'Kingdom'} routes={[]}>
            <div className="kingdom-overview-page">
                <div className="kingdom-overview-page__header">
                    <div className="kingdom-overview-page__header-left">
                        <h1>{kingdom?.name}</h1>
                        <span className="kingdom-overview-page__id">ID: {kingdom?.id}</span>
                    </div>
                    <button className="custom-button subtle-button" onClick={handleBackToLobby}>
                        Back to Lobby
                    </button>
                </div>

                <div className="kingdom-overview-page__instructions">
                    <p>
                        🖱️ Click and drag to pan the map. Hover to see region boundaries. Click a
                        region to inspect details.
                    </p>
                </div>

                <div className="kingdom-overview-page__canvas-container" ref={containerRef}>
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

                    {selectedRegion && regionStats && (
                        <KingdomRegionOverlay
                            selectedRegion={selectedRegion}
                            regionStats={regionStats}
                            setSelectedRegion={setSelectedRegion}
                        />
                    )}
                </div>
            </div>
        </Page>
    );
};

export default KingdomOverviewPage;
