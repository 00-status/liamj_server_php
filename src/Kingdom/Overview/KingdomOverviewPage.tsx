import { useMemo, useState } from 'react';

import './kingdom-overview-page.css';
import { Page } from '../../SharedComponents/Page/Page';

import { Tile } from './Tile';
import { generateWeightedTerrain } from './util';
import { TileDetails } from './TileDetails';
import { GameContext, Kingdom, Tile as TileType } from './domain/types';
import { addTerrainFeatures } from './domain/addTerrainFeatures';
import { Building } from './domain/buildings';

const terrain = generateWeightedTerrain(30, 30);
const terrainWithFeatures = addTerrainFeatures(terrain);
// const centerTerrain = extractCenterGrid(terrainWithFeatures, 3);

const kingdom: Kingdom = {
    name: 'Camelot',
    terrain: terrainWithFeatures,
};

const KingdomOverviewPage = () => {
    const [gameContext, setGameContext] = useState<GameContext>({
        selectedTile: null,
        resources: {},
        constructedBuildings: [],
    });

    const [orderedTiles, setOrderedTiles] = useState<Array<TileType>>([]);
    const [currentTile, setCurrentTile] = useState<TileType | null>(null);

    const [activeTileKey, setActiveTileKey] = useState<string | null>(null);

    useMemo(() => {
        const tilesByCoords = kingdom.terrain.tiles.reduce(
            (carry, tile) => {
                const key = `${tile.x}-${tile.y}`;
                carry[key] = tile;

                return carry;
            },
            {} as { [key: string]: TileType },
        );

        const orderedTiles = [];
        for (let y = 0; y < kingdom.terrain.columnSize; y++) {
            for (let x = 0; x < kingdom.terrain.rowSize; x++) {
                const tile = tilesByCoords[`${x}-${y}`];
                if (tile) {
                    orderedTiles.push(tile);
                }
            }
        }

        setOrderedTiles(orderedTiles);
    }, [kingdom]);

    const onSelectTile = (tile: TileType, tileKey: string) => {
        setCurrentTile({ ...tile });
        setActiveTileKey(tileKey);
        setGameContext((state) => {
            return { ...state, selectedTile: tile };
        });
    };

    const styles = { gridTemplateColumns: Array(kingdom.terrain.columnSize).fill('1fr').join(' ') };

    return (
        <Page title="Kingdom" routes={[]}>
            <div className="kingdom-overview-page">
                <h1>Overview</h1>
                <div className="kingdom-overview-page__content">
                    <div className="kingdom-overview-page__grid" style={styles}>
                        {orderedTiles.map((tile) => {
                            const tileKey = tile.x + '-' + tile.y;
                            return (
                                <Tile
                                    key={tileKey}
                                    type={tile.type}
                                    onClick={() => {
                                        onSelectTile(tile, tileKey);
                                    }}
                                    isActive={activeTileKey === tileKey}
                                />
                            );
                        })}
                    </div>
                    <div className="kingdom-overview-page__tile-details">
                        {currentTile && (
                            <TileDetails
                                tile={currentTile}
                                buildings={gameContext.constructedBuildings.filter(
                                    (building) => building.assignedTile === currentTile.id,
                                )}
                                setBuildings={(newBuilding: Building) => {
                                    setGameContext((state) => ({
                                        ...state,
                                        constructedBuildings: [
                                            ...state.constructedBuildings,
                                            newBuilding,
                                        ],
                                    }));
                                }}
                                gameContext={gameContext}
                            />
                        )}
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default KingdomOverviewPage;
