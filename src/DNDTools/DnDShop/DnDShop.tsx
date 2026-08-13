import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';

import './dnd-shop.css';
import { Page } from '../../SharedComponents/Page/Page';
import { dndRoutes } from '../domain';

import { items } from './domain/itemUtil';
import { Currency, Item } from './domain/types';
import { Total } from './Total';
import { generateEmptyCartSlots } from './domain/util';
import { PlayerCurrency } from './PlayerCurrency';
import { Inventory } from './Inventory/Inventory';
import { InventoryItem } from './Inventory/InventoryItem';
import { Cart } from './Cart/Cart';

export type CartSlot = { droppableID: string; item: null | Item };

const DndShop = () => {
    const [playerCurrency, setPlayerCurrency] = useState<Currency>({
        gold: 0,
        silver: 0,
        copper: 0,
    });
    const [cartSlots, setCartSlots] = useState<CartSlot[]>(generateEmptyCartSlots(0, 3));
    const [currentItem, setCurrentItem] = useState<{
        name: string;
        cost: number;
        currency: string;
    } | null>(null);

    const onDragStart = (event: DragStartEvent) => {
        const data = event.active.data;

        if (data && data?.current) {
            setCurrentItem({
                name: data.current.name,
                cost: data.current.cost,
                currency: data.current.currency,
            });
        }
    };

    const onDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        setCurrentItem(null);

        if (!over || !active) {
            return;
        }

        const cartSlotsCopy = [...cartSlots];
        const droppedSlotIndex = cartSlotsCopy.findIndex((slot) => {
            return slot.droppableID === over.id;
        });

        const droppedItem: Item | undefined = items.find((item) => {
            return item.name === active.id;
        });

        if (!droppedItem) {
            return;
        }

        cartSlotsCopy[droppedSlotIndex] = {
            droppableID: String(over.id),
            item: droppedItem,
        };

        setCartSlots(cartSlotsCopy);
    };

    return (
        <Page title="D&D Tools" routes={dndRoutes}>
            <div className="dnd-shop">
                <h1>The Shop</h1>
                <PlayerCurrency
                    playerCurrency={playerCurrency}
                    setPlayerCurrency={setPlayerCurrency}
                />
                <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                    <div className="dnd-shop__container">
                        <div className="dnd-shop__top">
                            <Cart cartSlots={cartSlots} setCartSlots={setCartSlots} />
                            <Inventory items={items} />
                        </div>
                        <div>
                            <Total playerCurrency={playerCurrency} cartItems={cartSlots} />
                        </div>
                    </div>
                    <DragOverlay>
                        {currentItem && (
                            <InventoryItem
                                name={currentItem.name}
                                cost={currentItem.cost}
                                currency={currentItem.currency}
                            />
                        )}
                    </DragOverlay>
                </DndContext>
            </div>
        </Page>
    );
};

export default DndShop;
