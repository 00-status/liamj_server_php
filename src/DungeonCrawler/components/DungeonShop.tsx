import { useMemo } from 'react';

import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { Card } from '../../SharedComponents/Card/Card';
import { exampleEquippables } from '../domain/equippables';
import { Equipment } from '../domain/types';
import { randomizeArray } from '../domain/utiils';

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
    const items = useMemo(() => {
        const nonPurchasedItems = exampleEquippables.filter((item) =>
            purchasedItems.find((purchasedItem) => purchasedItem.id !== item.id),
        );

        return randomizeArray<Equipment>(nonPurchasedItems).slice(0, 2);
    }, [purchasedItems]);

    return (
        <Card title="Shop">
            {items.map((item) => {
                const isPurchaseable = playerWealth > item.cost;
                const action = isPurchaseable ? () => onPlayerPurchase(item.id) : undefined;

                return (
                    <div
                        key={item.id}
                        className={
                            isPurchaseable ? 'dungeon-shop__item' : 'dungeon-shop__item--disabled'
                        }
                    >
                        {`${item.name} | ${item.cost} coins`}
                        <Button buttonTheme={ButtonTheme.Subtle} onClick={action}>
                            Purchase
                        </Button>
                    </div>
                );
            })}
            <Button buttonTheme={ButtonTheme.Subtle} onClick={onPlayerContinue}>
                Rest and Continue
            </Button>
        </Card>
    );
};
