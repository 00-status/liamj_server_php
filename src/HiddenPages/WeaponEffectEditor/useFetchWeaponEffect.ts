import { useCallback, useState } from 'react';

import { WeaponEffect } from '../WeaponEffectEditor/WeaponEffectForm';

type UseFetchWeaponEffect = {
    weaponEffects: Array<WeaponEffect>;
    fetchWeaponEffects: () => void;
};

export const useFetchWeaponEffect = (): UseFetchWeaponEffect => {
    const [weaponEffects, setWeaponEffects] = useState([]);

    const fetchWeaponEffects = useCallback(() => {
        fetch('/api/1/weapon_effects')
            .then((response) => response.json())
            .then((json) => setWeaponEffects(json));
    }, [setWeaponEffects]);

    return { weaponEffects, fetchWeaponEffects };
};
