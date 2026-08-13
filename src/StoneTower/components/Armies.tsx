import { ArmyToken } from './ArmyToken';
import './armies.css';

type Props = { armyCount: number; maxArmyCount: number };

export const Armies = ({ armyCount, maxArmyCount }: Props) => {
    const missingArmyCount = maxArmyCount - armyCount;

    const armyArray = Array(armyCount).fill(0);
    const missingArmyArray = Array(missingArmyCount).fill(0);

    return (
        <div className="armies">
            {armyArray.map((value, index) => (
                <ArmyToken key={`army-token-${index}`} />
            ))}
            {missingArmyArray.map((value, index) => (
                <ArmyToken key={`disabled-army-token-${index}`} isDisabled />
            ))}
        </div>
    );
};
