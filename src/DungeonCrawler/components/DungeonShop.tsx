import { useMemo, useState } from 'react';

import './dungeon-shop.css';
import { exampleEquippables } from '../domain/equippables';
import { Equipment } from '../domain/types';
import { randomizeArray } from '../domain/utils';
import { formatModifier } from '../domain/items/formatModifier';

import { DungeonButton } from './DungeonButton';

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
        <div className="dungeon-shop">
            {items.map((item) => {
                const isPurchaseable = playerWealth >= item.cost;
                const action = isPurchaseable ? () => onPlayerPurchase(item.id) : undefined;

                return (
                    <div
                        key={item.id}
                        role="button"
                        className={`dungeon-shop__item ${!isPurchaseable && 'dungeon-shop__item--disabled'}`}
                        onClick={isPurchaseable ? action : undefined}
                    >
                        <h3>
                            {item.name} | {`${item.cost} coins`}
                        </h3>
                        <div className="dungeon-shop__item-modifier-grid">
                            {item.modifiers.map((modifier) => (
                                <div key={modifier.id}>{formatModifier(modifier)}</div>
                            ))}
                        </div>
                    </div>
                );
            })}
            <div>
                <DungeonButton onClick={onPlayerContinue}>Rest and Continue</DungeonButton>
            </div>
        </div>
    );
};
