import { useMemo } from 'react';

import './character-equipment.css';
import type { Equipment} from '../../domain/types';
import { EquipmentSlot } from '../../domain/types';

type Props = {
    characterID: string;
    purchasedEquipment: Equipment[];
    characterEquipment: Equipment[];
    onEquipmentSelect: (
        previousEquippableID: string | null,
        newEquippableID: string | null,
        characterID: string,
    ) => void;
};

export const CharacterEquipment = ({
    characterID,
    purchasedEquipment,
    characterEquipment,
    onEquipmentSelect,
}: Props) => {
    const equippedWeapon = useMemo(() => {
        return characterEquipment.find((item) => item.slot === EquipmentSlot.weapon);
    }, [characterEquipment]);

    const equippedArmour = useMemo(() => {
        return characterEquipment.find((item) => item.slot === EquipmentSlot.armour);
    }, [characterEquipment]);

    const equippedTrinkets = useMemo(() => {
        return characterEquipment.filter((item) => item.slot === EquipmentSlot.trinket);
    }, [characterEquipment]);

    const equippedTrinket1 = equippedTrinkets[0];
    const equippedTrinket2 = equippedTrinkets[1];

    const weaponOptions = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.weapon &&
                (!item.characterID || item.id === equippedWeapon?.id),
        );
    }, [purchasedEquipment, equippedWeapon]);

    const armourOptions = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.armour &&
                (!item.characterID || item.id === equippedArmour?.id),
        );
    }, [purchasedEquipment, equippedArmour]);

    const trinket1Options = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.trinket &&
                (!item.characterID || item.id === equippedTrinket1?.id),
        );
    }, [purchasedEquipment, equippedTrinket1]);

    const trinket2Options = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.trinket &&
                (!item.characterID || item.id === equippedTrinket2?.id),
        );
    }, [purchasedEquipment, equippedTrinket2]);
    return (
        <div className="character-equipment">
            <select
                className="character-equipment__select"
                value={equippedWeapon?.id || ''}
                aria-label="Weapon"
                onChange={(e) =>
                    onEquipmentSelect(
                        equippedWeapon?.id || null,
                        e.target.value || null,
                        characterID,
                    )
                }
            >
                <option value="">Weapon</option>
                {weaponOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
            <select
                className="character-equipment__select"
                value={equippedArmour?.id || ''}
                aria-label="Armour"
                onChange={(e) =>
                    onEquipmentSelect(
                        equippedArmour?.id || null,
                        e.target.value || null,
                        characterID,
                    )
                }
            >
                <option value="">Armour</option>
                {armourOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
            <select
                className="character-equipment__select"
                value={equippedTrinket1?.id || ''}
                aria-label="Trinket 1"
                onChange={(e) =>
                    onEquipmentSelect(
                        equippedTrinket1?.id || null,
                        e.target.value || null,
                        characterID,
                    )
                }
            >
                <option value="">Trinket</option>
                {trinket1Options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
            <select
                className="character-equipment__select"
                value={equippedTrinket2?.id || ''}
                aria-label="Trinket 2"
                onChange={(e) =>
                    onEquipmentSelect(
                        equippedTrinket2?.id || null,
                        e.target.value || null,
                        characterID,
                    )
                }
            >
                <option value="">Trinket</option>
                {trinket2Options.map((item) => (
                    <option key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>
        </div>
    );
};
