import { useState } from 'react';
import { gtag } from 'ga-gtag';

import './weapon-maker.css';
import { Button } from '../../SharedComponents/Button/Button';
import { Page } from '../../SharedComponents/Page/Page';
import { dndRoutes } from '../domain';
import { Dropdown } from '../../SharedComponents/Dropdown/Dropdown';
import { Loader } from '../../SharedComponents/Loader/Loader';
import { Icon } from '../../SharedComponents/Icon/Icon';
import { IconType } from '../../SharedComponents/Icon/domain';

import { WeaponCard } from './WeaponCard';
import { useGenerateWeapon } from './useGenerateWeapon';

const WeaponMaker = () => {
    const [selectedRarity, setSelectedRarity] = useState<string>('Uncommon');

    const { weapon, generateWeapon, isLoading } = useGenerateWeapon();

    const rarities = [
        { value: 'Uncommon', label: 'Uncommon' },
        { value: 'Rare', label: 'Rare' },
        { value: 'Very Rare', label: 'Very Rare' },
        { value: 'Legendary', label: 'Legendary' },
    ];

    const onGenerateWeaponclick = () => {
        gtag('event', 'button_click_weapon_maker');
        generateWeapon(selectedRarity);
    };

    return (
        <Page
            routes={dndRoutes}
            title="D&D Tools"
            footer={<div>The weapon's name is generated using Google Gemeni (AI).</div>}
        >
            <div className="weapon-maker">
                <div>
                    <h1>Weapon Maker</h1>
                </div>
                <div className="weapon-maker__filters">
                    <div className="weapon-maker__dropdown">
                        <Dropdown
                            defaultValue="Uncommon"
                            options={rarities}
                            onOptionSelect={(option) => {
                                if (option) {
                                    setSelectedRarity(option);
                                }
                            }}
                        />
                    </div>
                    <div className="weapon-maker__button">
                        <Button disabled={isLoading} hasSheen onClick={onGenerateWeaponclick}>
                            <Icon iconType={IconType.GEARS} />
                            Make weapon
                        </Button>
                    </div>
                </div>
                <div>
                    {isLoading && <Loader />}
                    {!isLoading && weapon && (
                        <div className="weapon-maker__card">
                            <WeaponCard weapon={weapon} />
                        </div>
                    )}
                </div>
            </div>
        </Page>
    );
};

export default WeaponMaker;
