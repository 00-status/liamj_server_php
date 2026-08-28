import { useMemo, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import './kingdom-overview-page.css';
import { Page } from '../../../SharedComponents/Page/Page';
import { Loader } from '../../../SharedComponents/Loader/Loader';
import { Button } from '../../../SharedComponents/Button/Button';
import { useKingdom } from '../../hooks/useKingdom';
import { Region } from '../../domain/types';
import { calculateRegionTileCounts } from '../../domain/util';
import { KingdomLayout } from '../KingdomLayout';

import { KingdomRegionOverlay } from './KingdomRegionOverlay';
import { KingdomCanvas } from './KingdomCanvas';

type Props = { kingdomId?: number | null };

export const KingdomOverviewPage = ({ kingdomId: propKingdomId }: Props) => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const kingdomIdStr = searchParams.get('id');
    const paramKingdomId = kingdomIdStr ? parseInt(kingdomIdStr, 10) : null;

    const kingdomId = propKingdomId ?? paramKingdomId;

    const { kingdom, isLoading, error } = useKingdom(kingdomId);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);

    // Calculate totals of selected region
    const regionStats = useMemo(() => {
        if (!selectedRegion) {
            return null;
        }

        return calculateRegionTileCounts(selectedRegion.tiles);
    }, [selectedRegion]);

    const handleBackToLobby = () => {
        navigate('/unlisted/kingdom');
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
            <KingdomLayout title="Kingdom Overview">
                <div className="kingdom-overview-page kingdom-overview-page--error">
                    <div className="kingdom-overview-page__error-card">
                        <h2>Error Loading Kingdom</h2>
                        <p>{error || 'No valid Kingdom ID was specified.'}</p>
                        <Button onClick={handleBackToLobby}>Return to Lobby</Button>
                    </div>
                </div>
            </KingdomLayout>
        );
    }

    return (
        <KingdomLayout title={kingdom ? `Kingdom: ${kingdom.name}` : 'Kingdom'}>
            <div className="kingdom-overview-page">
                <div>
                    <p>
                        🖱️ Click and drag to pan the map. Hover to see region boundaries. Click a
                        region to inspect details.
                    </p>
                </div>
                <div className="kingdom-overview-page__contents">
                    <div className="kingdom-overview-page__sidebar">
                        <h2>Sidebar</h2>
                    </div>
                    <div className="kingdom-overview-page__canvas-container" ref={containerRef}>
                        <KingdomCanvas
                            kingdom={kingdom}
                            containerRef={containerRef}
                            setSelectedRegion={setSelectedRegion}
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
            </div>
        </KingdomLayout>
    );
};

export default KingdomOverviewPage;
