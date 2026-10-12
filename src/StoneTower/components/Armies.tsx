import { ArmyToken } from './ArmyToken';
import './armies.css';

type Props = { armyCount: number; maxArmyCount: number };

export const Armies = ({ armyCount, maxArmyCount }: Props) => {
    const slots = Array.from({ length: maxArmyCount }, (_, slotIndex) => {
        return {
            id: `army-slot-${slotIndex}`,
            isActive: slotIndex < armyCount,
        };
    });

    return (
        <div className="armies">
            {slots.map((slot) => (
                <ArmyToken key={slot.id} isDisabled={!slot.isActive} />
            ))}
        </div>
    );
};
