import { useDraggable } from '@dnd-kit/core';

import './inventory-item.css';
import { Icon } from '../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../SharedComponents/Icon/domain';

type Props = {
    name: string;
    cost: number;
    currency: string;
};

export const InventoryItem = (props: Props) => {
    const { attributes, listeners, setNodeRef } = useDraggable({
        id: props.name,
        data: { name: props.name, cost: props.cost, currency: props.currency },
    });

    return (
        <div className="inventory-item" ref={setNodeRef}>
            <div className="inventory-item__icon" {...listeners} {...attributes}>
                <Icon iconType={IconType.DRAG} />
            </div>
            <div className="inventory-item__body">
                <div>{props.name}</div>
                <div className="inventory-item__cost">
                    {props.cost} {props.currency}
                </div>
            </div>
        </div>
    );
};
