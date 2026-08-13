import { useCallback } from 'react';

import { WeaponEffect } from './WeaponEffectForm';

type UseSaveWeapon = {
    saveWeaponEffect: (weaponEffect: WeaponEffect) => void;
};

export const useSaveWeaponEffect = (): UseSaveWeapon => {
    const saveWeaponEffect = useCallback((weaponEffect: WeaponEffect) => {
        const weaponEffectJson = JSON.stringify(weaponEffect);

        fetch('/api/1/weapon_effects', {
            method: 'POST',
            body: weaponEffectJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }, []);

    return {
        saveWeaponEffect,
    };
};
