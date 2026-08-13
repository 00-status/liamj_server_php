import { useMemo, useState } from 'react';

import './tile-details.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Button } from '../../SharedComponents/Button/Button';
import { Dropdown } from '../../SharedComponents/Dropdown/Dropdown';

import { GameContext, Tile } from './domain/types';
import { Building, buildingsList } from './domain/buildings';

type Props = {
    tile: Tile;
    buildings: Array<Building>;
    setBuildings: (newBuilding: Building) => void;
    gameContext: GameContext;
};

export const TileDetails = (props: Props) => {
    const { tile, buildings, setBuildings, gameContext } = props;

    const [buildingID, setBuildingID] = useState<string>('');

    const validBuildingsOptions = useMemo(() => {
        const validBuildings = buildingsList
            .filter((building) =>
                building.requirements.every((requirement) => requirement.check(gameContext)),
            )
            .map((building) => ({
                value: building.id,
                label: building.name,
            }));

        validBuildings.unshift({ value: '', label: '' });
        return validBuildings;
    }, [gameContext]);

    return (
        <Card title={tile.type}>
            <div className="tile-details">
                <div>
                    {tile.traits.length > 0 && (
                        <div>
                            <h3>Terrain Traits</h3>
                            <ul>
                                {tile.traits.map((trait) => (
                                    <li key={trait}>{trait}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div>
                    <h3>Buildings</h3>
                    <div className="tile-details__buildings-form">
                        <Dropdown
                            id="modal-building-construct"
                            defaultValue={buildingID}
                            options={validBuildingsOptions}
                            onOptionSelect={(value) => setBuildingID(value)}
                            isDisabled={buildings.length > 0}
                        />
                        <Button
                            disabled={!buildingID}
                            onClick={() => {
                                const selectedBuilding = buildingsList.find(
                                    (building) => building.id === buildingID,
                                );

                                if (!selectedBuilding) {
                                    return;
                                }

                                setBuildings({ ...selectedBuilding, assignedTile: tile.id });
                                setBuildingID('');
                            }}
                        >
                            Add Building
                        </Button>
                    </div>
                    {buildings.length > 0 && (
                        <div>
                            <ul>
                                {buildings.map((building) => (
                                    <li key={building.name}>{building.name}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};
