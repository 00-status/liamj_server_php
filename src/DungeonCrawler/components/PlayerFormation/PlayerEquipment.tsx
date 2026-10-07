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
    onSelectEquipment: (item: Equipment, combatantID: string) => void;
};

export const PlayerEquipment = ({ purchasedEquipment, combatant, onSelectEquipment }: Props) => {
    const handleSelectEquipment = useCallback(
        (id: string) => {
            if (!id) {
                return;
            }

            const chosenEquipment = purchasedEquipment.find((item) => item.id === id);
            if (chosenEquipment) {
                onSelectEquipment(chosenEquipment, combatant.id);
            }
        },
        [purchasedEquipment, combatant.id, onSelectEquipment],
    );

    return (
        <div>
            <div>
                {EQUIPMENT_CONFIG.map(({ label, slot }) => {
                    const selectedItem = combatant.character.equipables.find(
                        (item) => item.slot === slot,
                    );

                    const options = purchasedEquipment
                        .filter((item) => item.slot === slot && !item.active)
                        .map((item) => ({ label: item.name, value: item.id }));

                    return (
                        <Dropdown
                            key={slot}
                            label={label}
                            defaultValue={selectedItem?.id || ''}
                            options={[...options, { label: '', value: '' }]}
                            onOptionSelect={handleSelectEquipment}
                        />
                    );
                })}
            </div>
        </div>
    );
};
