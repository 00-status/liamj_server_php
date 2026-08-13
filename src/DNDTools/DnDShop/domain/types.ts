export type Item = {
    name: string;
    cost: number;
    currency: CurrencyEnum;
    weight: number | null;
};

export type Currency = {
    gold: number;
    silver: number;
    copper: number;
};

export enum CurrencyEnum {
    Gold = 'gold',
    Silver = 'silver',
    Copper = 'copper',
}
