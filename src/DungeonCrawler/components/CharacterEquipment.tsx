import { useMemo } from 'react';

import './character-equipment.css';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { Card } from '../../SharedComponents/Card/Card';
import { Equipment, StatModifier } from '../domain/types';
import { BaseStatDisplayNames } from '../domain/constants';

type Props = { equippables: Equipment[]; toggleEquipmentActive: (name: string) => void };

export const CharacterEquipment = ({ equippables, toggleEquipmentActive }: Props) => {
    const isPlayerAtItemCap = useMemo(() => {
        const activeEquipment = equippables.filter((equipment) => equipment.active).length;
        console.log(activeEquipment);
        return activeEquipment >= 3;
    }, [equippables]);

    return (
        <Card title="Equipment">
            <div className="character-equipment">
                {equippables.map((equippable) => {
                    return (
                        <div key={equippable.name}>
                            <div className="character-equipment__item-header">
                                <h3>
                                    {equippable.name} | {equippable.slot}
                                </h3>
                                <Button
                                    onClick={() => toggleEquipmentActive(equippable.name)}
                                    buttonTheme={ButtonTheme.Subtle}
                                    disabled={!equippable.active && isPlayerAtItemCap}
                                >
                                    {equippable.active ? 'Un-Equip' : 'Equip'}
                                </Button>
                            </div>
                            <div>{equippable.active ? 'Equipped' : 'Unequipped'}</div>
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

const formatEquipmentModifier = (modifier: StatModifier): string => {
    const formattedValue = formatModifierValue(modifier);
    const statName = BaseStatDisplayNames[modifier.stat] ?? modifier.stat;

    return `${formattedValue} ${statName}`;
};

const formatModifierValue = (modifier: StatModifier): string => {
    const { value, type } = modifier;

    if (type === 'percent') {
        const delta = Math.round((value - 1) * 100);
        const sign = delta >= 0 ? '+' : '';
        return `${sign}${delta}%`;
    }

    const sign = value >= 0 ? '+' : '';
    return `${sign}${value}`;
};
