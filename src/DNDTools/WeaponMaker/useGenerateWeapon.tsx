import { useCallback, useState } from 'react';

import { Weapon } from './domain/types';

type UseGenerateWeapon = {
    weapon: Weapon | null;
    generateWeapon: (rarity: string) => void;
    isLoading: boolean;
};

export const useGenerateWeapon = (): UseGenerateWeapon => {
    const [weapon, setWeapon] = useState<Weapon | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const generateWeapon = useCallback(
        (rarity: string) => {
            setIsLoading(true);
            fetch('/api/1/generate_weapon?rarity=' + rarity)
                .then((response: Response) => response.json())
                .then((json) => {
                    setWeapon(json);
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        [setWeapon],
    );

    return {
        weapon,
        generateWeapon,
        isLoading,
    };
};
