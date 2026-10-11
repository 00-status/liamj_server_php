import { useMemo, useState } from 'react';

import './dungeon-shop.css';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { Card } from '../../SharedComponents/Card/Card';
import { exampleEquippables } from '../domain/equippables';
import { Equipment } from '../domain/types';
import { randomizeArray } from '../domain/utils';
import { formatModifier } from '../domain/items/formatModifier';

type Props = {
    purchasedItems: Equipment[];
    playerWealth: number;
    onPlayerPurchase: (itemID: string) => void;
    onPlayerContinue: () => void;
};

export const DungeonShop = ({
    purchasedItems,
    playerWealth,
    onPlayerPurchase,
    onPlayerContinue,
}: Props) => {
    const [offeredItemIDs] = useState<string[]>(() => {
        const nonPurchasedItems = exampleEquippables.filter((item) => {
            return !purchasedItems.some((purchasedItem) => purchasedItem.id === item.id);
        });

        return randomizeArray<Equipment>(nonPurchasedItems)
            .slice(0, 3)
            .map((item) => item.id);
    });

    const items = useMemo(() => {
        return exampleEquippables.filter(
            (item) =>
                offeredItemIDs.includes(item.id) &&
                !purchasedItems.some((purchasedItem) => purchasedItem.id === item.id),
        );
    }, [offeredItemIDs, purchasedItems]);

    return (
        <Card title="Shop">
            <div className="dungeon-shop">
                {items.map((item) => {
                    const isPurchaseable = playerWealth >= item.cost;
                    const action = isPurchaseable ? () => onPlayerPurchase(item.id) : undefined;

                    return (
                        <div
                            key={item.id}
                            className={
                                isPurchaseable
                                    ? 'dungeon-shop__item'
                                    : 'dungeon-shop__item--disabled'
                            }
                        >
                            <div>
                                <h3>
                                    {item.name} | {item.slot}
                                </h3>
                                {`Costs ${item.cost} coins.`}
                                <div>
                                    {item.modifiers.map((modifier) => (
                                        <div key={modifier.id}>{formatModifier(modifier)}</div>
                                    ))}
                                </div>
                            </div>
                            <Button
                                buttonTheme={ButtonTheme.Subtle}
                                onClick={action}
                                disabled={!isPurchaseable}
                            >
                                Purchase
                            </Button>
                        </div>
                    );
                })}
                <Button buttonTheme={ButtonTheme.Subtle} onClick={onPlayerContinue}>
                    Rest and Continue
                </Button>
            </div>
        </Card>
    );
};
