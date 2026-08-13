import { useEffect, useState } from 'react';

import './weapon-effect-list.css';
import { Page } from '../../SharedComponents/Page/Page';
import { WeaponEffect, WeaponEffectForm } from '../WeaponEffectEditor/WeaponEffectForm';

import { useFetchWeaponEffect } from './useFetchWeaponEffect';

const WeaponEffectList = () => {
    const { weaponEffects, fetchWeaponEffects } = useFetchWeaponEffect();

    const [currentWeaponEffect, setCurrentWeaponEffect] = useState<WeaponEffect | null>(null);

    useEffect(() => {
        fetchWeaponEffects();
    }, []);

    return (
        <Page title="Weapon Effects" routes={[{ label: 'Landing', route: '/' }]}>
            <div className="weapon-effect-list">
                <h1>Weapon Effect List</h1>
                <div className="weapon-effect-list__container">
                    <div className="weapon-effect-list__list">
                        {weaponEffects.map((weaponEffect) => (
                            <div
                                className="weapon-effect-list__item"
                                onClick={() => setCurrentWeaponEffect(weaponEffect)}
                                key={weaponEffect.name}
                            >
                                {weaponEffect.name}
                            </div>
                        ))}
                    </div>
                    <div className="weapon-effect-list__form">
                        <WeaponEffectForm
                            weaponEffect={currentWeaponEffect ? currentWeaponEffect : undefined}
                            fetchWeaponEffects={fetchWeaponEffects}
                        />
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default WeaponEffectList;
