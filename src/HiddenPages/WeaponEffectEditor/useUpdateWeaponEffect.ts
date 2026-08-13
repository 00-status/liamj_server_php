import { useCallback } from 'react';

import { WeaponEffect } from './WeaponEffectForm';

type UseSaveWeapon = {
    updateWeaponEffect: (weaponEffect: WeaponEffect, id: number) => void;
};

export const useUpdateWeaponEffect = (): UseSaveWeapon => {
    const updateWeaponEffect = useCallback((weaponEffect: WeaponEffect, id: number) => {
        const weaponEffectJson = JSON.stringify(weaponEffect);

        fetch('/api/1/weapon_effects/' + id, {
            method: 'PUT',
            body: weaponEffectJson,
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));
    }, []);

    return {
        updateWeaponEffect,
    };
};
