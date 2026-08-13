import { useDroppable } from '@dnd-kit/core';

import './cart-item.css';
import { Item } from '../domain/types';
import { Button, ButtonTheme } from '../../../SharedComponents/Button/Button';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

type Props = {
    id: string;
    item: Item | null;
    deleteCartItem: (itemID: string) => void;
};

export const CartItem = (props: Props) => {
    const { id, item, deleteCartItem } = props;
    const { setNodeRef } = useDroppable({ id: id });

    if (!item) {
        return <div className="cart-item" ref={setNodeRef} />;
    }

    return (
        <div className="cart-item" ref={setNodeRef}>
            <div className="cart-item__header">
                <h3>{item?.name}</h3>
                <div>
                    <Button buttonTheme={ButtonTheme.Subtle} onClick={() => deleteCartItem(id)}>
                        <Icon iconType={IconType.TRASH} />
                    </Button>
                </div>
            </div>
            <div className="cart-item__body">
                <div>
                    Cost: {item?.cost} {item?.currency}
                </div>
                <div>
                    weight: {item?.weight}lb{Number(item.weight) > 1 ? 's' : ''}
                </div>
            </div>
        </div>
    );
};
