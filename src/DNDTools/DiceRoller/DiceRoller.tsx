import { ReactElement, useState } from 'react';
import { gtag } from 'ga-gtag';

import './dice-roller.css';
import { Page } from '../../SharedComponents/Page/Page';
import { dndRoutes } from '../domain';
import { Anchor } from '../../SharedComponents/Link/Anchor';

import { Die } from './Die';
import { CustomDiceRoller } from './CustomDiceRoller';

const dice: Array<number> = [4, 6, 8, 10, 12, 20];

const DiceRoller = (): ReactElement => {
    const [animationKey, setAnimationKey] = useState<number>(0);

    const [generatedNumber, setGeneratedNumber] = useState<number | null>(null);
    const [diceLog, setDiceLog] = useState<Array<string>>([]);

    const onDieClick = (diceResult: number, diceRolled: string, individualRolls: string[]) => {
        if (diceRolled === '1d20') {
            gtag('event', 'button_click_die_twenty');
        }

        setAnimationKey(animationKey + 1);
        setGeneratedNumber(diceResult);
        setDiceLog((state) => {
            return [...individualRolls, ...state];
        });
    };

    const footer = (
        <>
            UIcons by <Anchor link="https://www.flaticon.com/uicons" displayText="Flaticon" />
        </>
    );

    return (
        <Page title="D&D Tools" routes={dndRoutes} footer={footer}>
            <div className="dice-roller">
                <h1>Dice Roller</h1>
                <div className="dice-roller--result">
                    <h1 key={animationKey} className="dice-roller__result--value">
                        {generatedNumber ? generatedNumber : '--'}
                    </h1>
                    <hr className="divider" />
                    <div>Result</div>
                </div>
                <div className="dice-container">
                    {dice.map((die: number) => (
                        <Die key={die} diceType={die} callback={onDieClick} />
                    ))}
                </div>
                <CustomDiceRoller callback={onDieClick} />
                <hr className="divider" />
                <div className="dice-roller--log-container">
                    <h2>Log</h2>
                    <textarea
                        readOnly
                        className="dice-roller--log"
                        defaultValue={diceLog.join('\r\n')}
                    />
                </div>
            </div>
        </Page>
    );
};

export default DiceRoller;
