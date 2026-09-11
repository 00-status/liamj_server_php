import { Card } from '../../SharedComponents/Card/Card';
import { Equipment } from '../domain/types';

type Props = { equipables: Equipment[] };

export const CharacterEquipment = ({ equipables }: Props) => {
    return (
        <Card title="Equipment">
            <div>
                {equipables.map((equipable) => {
                    return (
                        <div key={equipable.name}>
                            <h3>
                                {equipable.name} | {equipable.slot}
                            </h3>
                            <div>
                                {equipable.modifiers.map((modifier) => (
                                    <div key={modifier.id}>
                                        {modifier.value} | {modifier.type} | {modifier.stat}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
