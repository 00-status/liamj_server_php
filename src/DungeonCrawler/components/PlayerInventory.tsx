import './character-inventory.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Equipment, BaseStatModifier, DamageScaleMethod } from '../domain/types';
import { BaseStatDisplayNames } from '../domain/constants';

type Props = { equippables: Equipment[]; wealth: number };

export const PlayerInventory = ({ equippables, wealth }: Props) => {
    return (
        <Card title="Inventory">
            <div className="character-inventory">
                <div>
                    <h3>Gold: {wealth}</h3>
                </div>
                {equippables.map((equippable) => {
                    return (
                        <div key={equippable.name}>
                            <div className="character-inventory__item-header">
                                <h3>
                                    {equippable.name} | {equippable.slot}
                                </h3>
                            </div>
                            <div>{equippable.characterID}</div>
                            <div>
                                {equippable.modifiers.map((modifier) => (
                                    <div key={modifier.id}>{formatEquipmentModifier(modifier)}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};

const formatEquipmentModifier = (modifier: BaseStatModifier): string => {
    const formattedValue = formatModifierValue(modifier);
    const statName = BaseStatDisplayNames[modifier.stat] ?? modifier.stat;

    return `${formattedValue} ${statName}`;
};

const formatModifierValue = (modifier: BaseStatModifier): string => {
    const { value, type } = modifier;

    if (type === DamageScaleMethod.PERCENT) {
        const delta = Math.round((value - 1) * 100);
        const sign = delta >= 0 ? '+' : '';
        return `${sign}${delta}%`;
    }

    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}`;
};
