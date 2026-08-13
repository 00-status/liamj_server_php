import { Rarity } from './constants';

export const getRarities = (weaponRarity: Rarity): Rarity[] => {
    switch (weaponRarity) {
        default:
        case Rarity.Uncommon:
            return [
                Rarity.Uncommon,
                Rarity.Uncommon,
                Rarity.Uncommon,
                Rarity.Uncommon,
                Rarity.Rare,
            ];
        case Rarity.Rare:
            return [Rarity.Uncommon, Rarity.Uncommon, Rarity.Rare, Rarity.Rare, Rarity.VeryRare];
        case Rarity.VeryRare:
            return [Rarity.Uncommon, Rarity.Rare, Rarity.Rare, Rarity.VeryRare, Rarity.VeryRare];
        case Rarity.Legendary:
            return [Rarity.Rare, Rarity.Rare, Rarity.VeryRare, Rarity.VeryRare, Rarity.Legendary];
    }
};
