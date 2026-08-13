import './inventory.css';
import { useDndContext } from '@dnd-kit/core';
import { useMemo, useState } from 'react';

import { Item } from '../domain/types';
import { TextInput } from '../../../SharedComponents/TextInput/TextInput';

import { InventoryItem } from './InventoryItem';

type Props = {
    items: Item[];
};

export const Inventory = (props: Props) => {
    const { items } = props;

    const [searchValue, setSearchValue] = useState<string>('');
    const dndContext = useDndContext();

    const filteredItems = useMemo(() => {
        if (searchValue) {
            return items.filter(
                (item) => item.name.toLowerCase().search(searchValue.toLowerCase()) !== -1,
            );
        }

        return items;
    }, [items, searchValue]);

    const styling = dndContext.active ? { overflow: 'hidden' } : undefined;

    return (
        <div className="inventory">
            <div className="inventory__search">
                <TextInput
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(value) => setSearchValue(value ?? '')}
                />
            </div>
            <div style={styling} className="inventory__list">
                {filteredItems.map((item) => {
                    return (
                        <InventoryItem
                            key={item.name}
                            name={item.name}
                            cost={item.cost}
                            currency={item.currency}
                        />
                    );
                })}
            </div>
        </div>
    );
};
