import jsonItems from '../../../assets/items.json';

import { CurrencyEnum, Item } from './types';

type RawItem = {
    name: string;
    cost: number;
    currency: string;
    weight: number | null;
};

const itemData: RawItem[] = jsonItems;

export const items: Item[] = itemData.map((item: RawItem) => {
    return {
        ...item,
        currency: item.currency as CurrencyEnum,
    };
});
