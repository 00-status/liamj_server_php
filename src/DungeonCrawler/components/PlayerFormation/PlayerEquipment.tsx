import { useCallback } from 'react';

import { Dropdown } from '../../../SharedComponents/Dropdown/Dropdown';
import { Combatant, Equipment, EquipmentSlot } from '../../domain/types';

const EQUIPMENT_CONFIG = [
    { label: 'Armour', slot: EquipmentSlot.armour },
    { label: 'Weapon', slot: EquipmentSlot.weapon },
    { label: 'Trinket', slot: EquipmentSlot.trinket },
];

type Props = {
    purchasedEquipment: Equipment[];
    combatant: Combatant;
    onSelectEquipment: (
        previousEquippableID: string | null,
        newEquippableID: string,
        combatantID: string,
    ) => void;
};

export const PlayerEquipment = ({ purchasedEquipment, combatant, onSelectEquipment }: Props) => {
    const handleSelectEquipment = useCallback(
        (previousEquippableID: string | null, newEquippableID: string) => {
            if (!newEquippableID) {
                return;
            }

            onSelectEquipment(previousEquippableID, newEquippableID, combatant.id);
        },
        [combatant.id, onSelectEquipment],
    );

    return (
        <div>
            <div>
                {EQUIPMENT_CONFIG.map(({ label, slot }) => {
                    const selectedEquippable = purchasedEquipment.find(
                        (item) => item.characterID === combatant.character.id,
                    );

                    const options = purchasedEquipment
                        .filter((item) => item.slot === slot && !!item.characterID)
                        .map((item) => ({ label: item.name, value: item.id }));

                    return (
                        <Dropdown
                            key={slot}
                            label={label}
                            defaultValue={selectedEquippable?.id || ''}
                            options={[...options, { label: '', value: '' }]}
                            onOptionSelect={(newEquippableID) =>
                                handleSelectEquipment(
                                    selectedEquippable?.id || null,
                                    newEquippableID,
                                )
                            }
                        />
                    );
                })}
            </div>
        </div>
    );
};
