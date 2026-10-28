import type { ReactElement } from 'react';

import type {
    BaseStatModifier,
    BaseStats,
    Equipment} from '../../../domain/types';
import {
    BaseStatNames,
    DamageScaleMethod,
    EquipmentSlot,
} from '../../../domain/types';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { Dropdown } from '../../../../SharedComponents/Dropdown/Dropdown';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import './equipment-editor.css';

interface EquipmentEditorProps {
    equipment: Equipment;
    onChange: (updatedEquipment: Equipment) => void;
    onDelete: (equipmentId: string) => void;
}

export const EquipmentEditor = ({
    equipment,
    onChange,
    onDelete,
}: EquipmentEditorProps): ReactElement => {
    const handleNameChange = (name?: string) => {
        onChange({
            ...equipment,
            name: name ?? '',
        });
    };

    const handleCostChange = (costString?: string) => {
        const cost = costString ? parseInt(costString, 10) : 0;
        onChange({
            ...equipment,
            cost: isNaN(cost) ? 0 : cost,
        });
    };

    const handleSlotChange = (slotValue: string) => {
        onChange({
            ...equipment,
            slot: slotValue as EquipmentSlot,
        });
    };

    const handleAddModifier = () => {
        const newModifier: BaseStatModifier = {
            id: crypto.randomUUID(),
            stat: BaseStatNames.attack,
            value: 0,
            type: DamageScaleMethod.FLAT,
        };

        onChange({
            ...equipment,
            modifiers: [...equipment.modifiers, newModifier],
        });
    };

    const handleRemoveModifier = (modifierId: string) => {
        onChange({
            ...equipment,
            modifiers: equipment.modifiers.filter((modifier) => modifier.id !== modifierId),
        });
    };

    const handleModifierChange = (
        modifierId: string,
        updatedFields: Partial<BaseStatModifier>,
    ) => {
        onChange({
            ...equipment,
            modifiers: equipment.modifiers.map((modifier) => {
                if (modifier.id === modifierId) {
                    return {
                        ...modifier,
                        ...updatedFields,
                    };
                }
                return modifier;
            }),
        });
    };

    const slotOptions = Object.values(EquipmentSlot).map((slot) => ({
        label: slot.charAt(0).toUpperCase() + slot.slice(1),
        value: slot,
    }));

    const statOptions = Object.values(BaseStatNames).map((stat) => ({
        label: stat,
        value: stat,
    }));

    const typeOptions = Object.values(DamageScaleMethod).map((type) => ({
        label: type,
        value: type,
    }));

    return (
        <div className="equipment-editor">
            <div className="equipment-editor__header">
                <h2>Edit Equipment</h2>
                <Button
                    buttonTheme={ButtonTheme.Delete}
                    onClick={() => onDelete(equipment.id)}
                >
                    Delete Equipment
                </Button>
            </div>

            <div className="equipment-editor__fields">
                <TextInput
                    id="equipment-id"
                    label="ID"
                    value={equipment.id}
                    readonly={true}
                />
                <TextInput
                    id="equipment-name"
                    label="Name"
                    value={equipment.name}
                    onChange={handleNameChange}
                />
                <TextInput
                    id="equipment-cost"
                    label="Cost"
                    numbersOnly={true}
                    value={equipment.cost.toString()}
                    onChange={handleCostChange}
                />
                <Dropdown
                    id="equipment-slot"
                    label="Slot"
                    defaultValue={equipment.slot}
                    options={slotOptions}
                    onOptionSelect={handleSlotChange}
                />
            </div>

            <div className="equipment-editor__modifiers-section">
                <div className="equipment-editor__modifiers-header">
                    <h3>Modifiers</h3>
                    <Button onClick={handleAddModifier}>Add Modifier</Button>
                </div>

                {equipment.modifiers.map((modifier) => (
                    <div key={modifier.id} className="equipment-editor__modifier-row">
                        <Dropdown
                            id={`stat-${modifier.id}`}
                            label="Stat"
                            defaultValue={modifier.stat}
                            options={statOptions}
                            onOptionSelect={(val) =>
                                handleModifierChange(modifier.id, {
                                    stat: val as keyof BaseStats,
                                })
                            }
                        />
                        <Dropdown
                            id={`type-${modifier.id}`}
                            label="Type"
                            defaultValue={modifier.type}
                            options={typeOptions}
                            onOptionSelect={(val) =>
                                handleModifierChange(modifier.id, {
                                    type: val as DamageScaleMethod,
                                })
                            }
                        />
                        <TextInput
                            id={`value-${modifier.id}`}
                            label="Value"
                            numbersOnly={true}
                            value={modifier.value.toString()}
                            onChange={(val) => {
                                const parsed = val ? parseFloat(val) : 0;
                                handleModifierChange(modifier.id, {
                                    value: isNaN(parsed) ? 0 : parsed,
                                });
                            }}
                        />
                        <Button
                            buttonTheme={ButtonTheme.Delete}
                            onClick={() => handleRemoveModifier(modifier.id)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
