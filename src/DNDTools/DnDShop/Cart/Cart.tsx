import './cart.css';
import { useEffect } from 'react';

import { generateEmptyCartSlots } from '../domain/util';
import { CartSlot } from '../DnDShop';

import { CartItem } from './CartItem';

type Props = {
    cartSlots: CartSlot[];
    setCartSlots: (slot: CartSlot[]) => void;
};

export const Cart = (props: Props) => {
    const { cartSlots, setCartSlots } = props;

    useEffect(() => {
        const lastItem = cartSlots.slice(-1);

        const hasAnItemInLastSlot = lastItem.find((cartSlot: CartSlot) => {
            return !!cartSlot.item;
        });

        if (hasAnItemInLastSlot) {
            const emptyCartSlots = generateEmptyCartSlots(cartSlots.length, 1);
            setCartSlots([...cartSlots, ...emptyCartSlots]);
        }
    }, [cartSlots, setCartSlots]);

    const deleteCartItem = (itemId: string) => {
        const indexToDelete = cartSlots.findIndex((cartSlot) => {
            return cartSlot.droppableID === itemId;
        });

        if (indexToDelete === -1) {
            return;
        }

        const cartSlotsCopy = [...cartSlots];
        cartSlotsCopy[indexToDelete].item = null;

        setCartSlots(cartSlotsCopy);
    };

    return (
        <div className="cart">
            {props.cartSlots.map((slot) => {
                return (
                    <CartItem
                        key={slot.droppableID}
                        deleteCartItem={deleteCartItem}
                        id={slot.droppableID}
                        item={slot.item}
                    />
                );
            })}
        </div>
    );
};
