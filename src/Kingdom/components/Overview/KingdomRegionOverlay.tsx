import { Dispatch, SetStateAction } from 'react';

import './kingdom-region-overlay.css';
import { Card } from '../../../SharedComponents/Card/Card';
import { TILE_COLORS } from '../../domain/colors';
import { Region } from '../../domain/types';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

type Props = {
    selectedRegion: Region;
    regionStats: Record<string, number>;
    setSelectedRegion: Dispatch<SetStateAction<Region | null>>;
};

export const KingdomRegionOverlay = ({ selectedRegion, regionStats, setSelectedRegion }: Props) => {
    return (
        <div className="kingdom-region-overlay">
            <Card
                title={selectedRegion.name}
                button={
                    <Button
                        onClick={() => setSelectedRegion(null)}
                        ariaLabel="Close"
                        buttonTheme={ButtonTheme.Subtle}
                    >
                        <Icon iconType={IconType.CLOSE} />
                    </Button>
                }
            >
                <div className="kingdom-region-overlay__card-content">
                    <div className="kingdom-region-overlay__stats-summary">
                        <div className="kingdom-region-overlay__stat">
                            <span className="kingdom-region-overlay__stat-label">Total Tiles:</span>
                            <span className="kingdom-region-overlay__stat-value">
                                {selectedRegion.tiles.length}
                            </span>
                        </div>
                        <div className="kingdom-region-overlay__stat">
                            <span className="kingdom-region-overlay__stat-label">
                                Origin Coordinate:
                            </span>
                            <span className="kingdom-region-overlay__stat-value">
                                ({selectedRegion.origin_x}, {selectedRegion.origin_y})
                            </span>
                        </div>
                    </div>

                    <h3 className="kingdom-region-overlay__breakdown-title">Tile Composition</h3>
                    <div className="kingdom-region-overlay__breakdown-grid">
                        {Object.entries(regionStats).map(([type, count]) => (
                            <div key={type} className="kingdom-region-overlay__breakdown-item">
                                <div className="kingdom-region-overlay__breakdown-header">
                                    <span
                                        className="kingdom-region-overlay__color-dot"
                                        style={{
                                            backgroundColor: TILE_COLORS[type] || '#444',
                                        }}
                                    />
                                    <span className="kingdom-region-overlay__breakdown-label">
                                        {type}
                                    </span>
                                </div>
                                <span className="kingdom-region-overlay__breakdown-value">
                                    {count}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    );
};
