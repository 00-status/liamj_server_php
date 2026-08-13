import './player-currency.css';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';

import { Currency, CurrencyEnum } from './domain/types';

type Props = {
    playerCurrency: Currency;
    setPlayerCurrency: (currency: Currency) => void;
};

export const PlayerCurrency = (props: Props) => {
    const { playerCurrency, setPlayerCurrency } = props;

    const onChangeCurrency = (type: CurrencyEnum, newValue?: string): void => {
        if (Number(newValue) < 0) {
            return;
        }

        const playerCurrencyCopy = { ...playerCurrency };
        playerCurrencyCopy[type] = newValue ? Number(newValue) : 0;

        setPlayerCurrency(playerCurrencyCopy);
    };

    return (
        <div className="player-currency">
            <TextInput
                placeholder="Gold"
                label="Gold"
                id="player-currency-gold"
                value={playerCurrency.gold !== 0 ? playerCurrency.gold : ''}
                numbersOnly={true}
                onChange={(value) => onChangeCurrency(CurrencyEnum.Gold, value)}
            />
            <TextInput
                placeholder="Silver"
                label="Silver"
                id="player-currency-silver"
                value={playerCurrency.silver !== 0 ? playerCurrency.silver : ''}
                numbersOnly={true}
                onChange={(value) => onChangeCurrency(CurrencyEnum.Silver, value)}
            />
            <TextInput
                placeholder="Copper"
                label="Copper"
                id="player-currency-copper"
                value={playerCurrency.copper !== 0 ? playerCurrency.copper : ''}
                numbersOnly={true}
                onChange={(value) => onChangeCurrency(CurrencyEnum.Copper, value)}
            />
        </div>
    );
};
