import './health-bar.css';
type Props = { health: number; maxHealth: number };

export const HealthBar = ({ health, maxHealth }: Props) => {
    const missingHealth = maxHealth - health;

    const healthArray = Array(health).fill(0);
    const missingHealthArray = Array(missingHealth).fill(0);
    return (
        <div className="health-bar">
            {healthArray.map((value, index) => (
                <div className="health-bar__marker" key={`health-value${index}`} />
            ))}
            {missingHealthArray.map((value, index) => (
                <div
                    className="health-bar__marker health-bar__marker--disabled"
                    key={`missing-health-value${index}`}
                />
            ))}
        </div>
    );
};
