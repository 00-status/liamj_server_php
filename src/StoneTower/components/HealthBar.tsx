import './health-bar.css';
type Props = { health: number; maxHealth: number };

export const HealthBar = ({ health, maxHealth }: Props) => {
    const markers = Array.from({ length: maxHealth }, (_, markerIndex) => {
        return {
            id: `health-marker-${markerIndex}`,
            isActive: markerIndex < health,
        };
    });

    return (
        <div className="health-bar">
            {markers.map((marker) => (
                <div
                    key={marker.id}
                    className={
                        'health-bar__marker' +
                        (marker.isActive ? '' : ' health-bar__marker--disabled')
                    }
                />
            ))}
        </div>
    );
};
