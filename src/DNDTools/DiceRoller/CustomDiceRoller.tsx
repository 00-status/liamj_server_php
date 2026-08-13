import { ReactElement, useState } from 'react';

import './custom-dice-roller.css';
import { TextInput } from '../../SharedComponents/TextInput/TextInput';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';

import { rollDie } from './util';

type Props = {
    callback: (diceResult: number, diceRolled: string, diceLog: string[]) => void;
};

type DiceRollResults = {
    total: number;
    diceRollResults: string[];
};

export const CustomDiceRoller = (props: Props): ReactElement => {
    const [diceCount, setDiceCount] = useState<number | null>(2);
    const [diceType, setDiceType] = useState<number | null>(6);

    const missingRequiredValues = !diceCount || !diceType;

    const rollDice = () => {
        if (missingRequiredValues) {
            return;
        }

        const diceTotals = [...Array(diceCount)].reduce<DiceRollResults>(
            (acc) => {
                const rollResult = rollDie(diceType);

                return {
                    total: acc.total + rollResult,
                    diceRollResults: [...acc.diceRollResults, '1d' + diceType + '=' + rollResult],
                };
            },
            { total: 0, diceRollResults: [] },
        );

        props.callback(diceTotals.total, diceCount + 'd' + diceType, [
            '-- ' + diceCount + 'd' + diceType + '=' + diceTotals.total + ' --',
            ...diceTotals.diceRollResults,
            '',
        ]);
    };

    return (
        <div className="custom-dice-roller">
            <div className="custom-dice-roller__form">
                <div className="custom-dice-roller__input">
                    <TextInput
                        numbersOnly
                        value={diceCount ?? ''}
                        onChange={(value) => setDiceCount(value ? Number(value) : null)}
                    />
                </div>
                <div>d</div>
                <div className="custom-dice-roller__input">
                    <TextInput
                        numbersOnly
                        value={diceType ?? ''}
                        onChange={(value) => setDiceType(value ? Number(value) : null)}
                    />
                </div>
                <Button
                    disabled={missingRequiredValues}
                    buttonTheme={ButtonTheme.Delete}
                    onClick={rollDice}
                >
                    Roll
                </Button>
            </div>
        </div>
    );
};
