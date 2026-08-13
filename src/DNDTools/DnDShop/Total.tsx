import './total.css';
import { CartSlot } from './DnDShop';
import { Currency, CurrencyEnum, Item } from './domain/types';

type ItemWithID = Item & { id: string };

type Props = {
    playerCurrency: Currency;
    cartItems: CartSlot[];
};

export const Total = (props: Props) => {
    const { cartItems, playerCurrency } = props;

    const filteredCartItems: ItemWithID[] = cartItems
        .map((item) => {
            if (!item.item) {
                return null;
            }

            return { ...item.item, id: item.droppableID };
        })
        .filter((item) => {
            return item !== null;
        });

    const itemTotalsByCurrency: Currency = getItemTotalsByCurrency(filteredCartItems);
    const normalizedTotalsByCurrency = normalizeTotals(itemTotalsByCurrency);

    const totalWeight = filteredCartItems.reduce((carry, item) => {
        return (carry += item.weight ? item.weight : 0);
    }, 0);

    const playerCurrencyRemaining = getPlayerCurrencyRemaining(
        playerCurrency,
        itemTotalsByCurrency,
    );

    return (
        <div className="total">
            <div className="total__list--fixed">
                {filteredCartItems.map((item) => (
                    <div key={item.id} className="total__list-item">
                        <div>{item.name}</div>{' '}
                        <div>
                            {item.cost} {item.currency}
                        </div>
                    </div>
                ))}
            </div>
            <h2>Total</h2>
            <div className="total__list">
                <div className="total__list-item">
                    <div>Weight (lbs):</div>
                    <div>{totalWeight}</div>
                </div>
                {Object.entries(CurrencyEnum).map(([key, value]) => {
                    return (
                        <div key={key} className="total__list-item">
                            <div>{key}:</div>
                            <div>{normalizedTotalsByCurrency[value]}</div>
                        </div>
                    );
                })}
            </div>
            <h2>Coins Remaining</h2>
            <div className="total__list">
                {Object.entries(CurrencyEnum).map(([key, value]) => {
                    return (
                        <div key={'Total|' + key} className="total__list-item">
                            <div>{key}:</div>
                            <div>{playerCurrencyRemaining[value]}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const getItemTotalsByCurrency = (items: Item[]): Currency => {
    return items.reduce(
        (carry: Currency, item) => {
            carry[item.currency] += item.cost;

            return carry;
        },
        { gold: 0, silver: 0, copper: 0 },
    );
};

const normalizeTotals = (itemTotalsByCurrency: Currency): Currency => {
    const remainingCopper = itemTotalsByCurrency.copper % 10;
    const newSilver = Math.trunc(itemTotalsByCurrency.copper / 10);

    const silver = newSilver + itemTotalsByCurrency.silver;
    const remainingSilver = silver % 10;
    const newGold = Math.trunc(silver / 10);

    return {
        gold: itemTotalsByCurrency.gold + newGold,
        silver: remainingSilver,
        copper: remainingCopper,
    };
};

const getPlayerCurrencyRemaining = (
    playerCurrency: Currency,
    itemTotalsByCurrency: Currency,
): Currency => {
    const playerCurrencyRemaining: Currency = {
        gold: playerCurrency.gold,
        silver: playerCurrency.silver,
        copper: playerCurrency.copper,
    };
    playerCurrencyRemaining.copper -= itemTotalsByCurrency.copper;

    playerCurrencyRemaining.silver -= itemTotalsByCurrency.silver;

    if (playerCurrencyRemaining.silver < 0) {
        playerCurrencyRemaining.silver += Math.trunc(playerCurrencyRemaining.copper / 10);
        playerCurrencyRemaining.copper = playerCurrencyRemaining.copper % 10;
    }

    playerCurrencyRemaining.gold -= itemTotalsByCurrency.gold;

    if (playerCurrencyRemaining.gold < 0) {
        playerCurrencyRemaining.gold += Math.trunc(playerCurrencyRemaining.silver / 10);
        playerCurrencyRemaining.silver = playerCurrencyRemaining.silver % 10;
    }

    if (playerCurrencyRemaining.gold < 0) {
        playerCurrencyRemaining.gold += Math.trunc(playerCurrencyRemaining.copper / 100);
        playerCurrencyRemaining.copper = playerCurrencyRemaining.copper % 10;
    }

    return playerCurrencyRemaining;
};
