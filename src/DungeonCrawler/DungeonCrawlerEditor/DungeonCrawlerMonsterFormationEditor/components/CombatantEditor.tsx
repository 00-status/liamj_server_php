import { ReactElement } from 'react';

import { MonsterCombatant } from '../../../domain/Combatant';
import {
    Ability,
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    BaseStats,
    CharacterTier,
} from '../../../domain/types';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { Dropdown } from '../../../../SharedComponents/Dropdown/Dropdown';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import { attackAbility } from '../../../domain/constants';

import './combatant-editor.css';

interface CombatantEditorProps {
    combatant: MonsterCombatant;
    onChange: (updatedCombatant: MonsterCombatant) => void;
    onDelete: (combatantId: string) => void;
}

export const CombatantEditor = ({
    combatant,
    onChange,
    onDelete,
}: CombatantEditorProps): ReactElement => {
    const handleCharacterChange = (fields: Partial<typeof combatant.character>) => {
        const updatedCharacter = {
            ...combatant.character,
            ...fields,
        };

        const updated = new MonsterCombatant(
            combatant.id,
            updatedCharacter,
            combatant.position,
            combatant.turnsUntilAction,
            combatant.critBag,
        );
        onChange(updated);
    };

    const handleStatChange = (statName: keyof BaseStats, valueString?: string) => {
        const parsed = valueString ? parseFloat(valueString) : 0;
        const newStats: BaseStats = {
            ...combatant.character.stats,
            [statName]: isNaN(parsed) ? 0 : parsed,
        };

        handleCharacterChange({ stats: newStats });
    };

    const handlePositionChange = (axis: 'x' | 'y', valueString: string) => {
        const parsed = parseInt(valueString, 10);
        const newPos = {
            ...combatant.position,
            [axis]: isNaN(parsed) ? 1 : Math.max(1, Math.min(3, parsed)),
        };

        const updated = new MonsterCombatant(
            combatant.id,
            combatant.character,
            newPos,
            combatant.turnsUntilAction,
            combatant.critBag,
        );
        onChange(updated);
    };

    const handleAddAbility = () => {
        const newAbility: Ability = {
            name: 'New Ability',
            cost: 1,
            type: AbilityType.skill,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [],
            statusEffects: [],
        };

        handleCharacterChange({
            abilities: [...combatant.character.abilities, newAbility],
        });
    };

    const handleAddAttackAbility = () => {
        handleCharacterChange({
            abilities: [...combatant.character.abilities, { ...attackAbility }],
        });
    };

    const handleRemoveAbility = (index: number) => {
        handleCharacterChange({
            abilities: combatant.character.abilities.filter((_, i) => i !== index),
        });
    };

    const handleAbilityChange = (index: number, updatedFields: Partial<Ability>) => {
        handleCharacterChange({
            abilities: combatant.character.abilities.map((ability, i) => {
                if (i === index) {
                    return { ...ability, ...updatedFields };
                }
                return ability;
            }),
        });
    };

    const tierOptions = [
        { label: 'Tier 1', value: '1' },
        { label: 'Tier 2', value: '2' },
        { label: 'Tier 3', value: '3' },
        { label: 'Tier 4', value: '4' },
    ];

    const posOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
    ];

    return (
        <div className="combatant-editor">
            <div className="combatant-editor__header">
                <h2>Edit Monster Combatant</h2>
                <Button
                    buttonTheme={ButtonTheme.Delete}
                    onClick={() => onDelete(combatant.id)}
                >
                    Delete Monster
                </Button>
            </div>

            <div className="combatant-editor__section">
                <h3>Identity</h3>
                <TextInput
                    id="combatant-id"
                    label="Combatant ID (Read Only)"
                    value={combatant.id}
                    readonly={true}
                />
                <TextInput
                    id="character-name"
                    label="Character Name"
                    value={combatant.character.name}
                    onChange={(val) => handleCharacterChange({ name: val ?? '' })}
                />
                <Dropdown
                    id="character-tier"
                    label="Tier"
                    defaultValue={combatant.character.tier.toString()}
                    options={tierOptions}
                    onOptionSelect={(val) =>
                        handleCharacterChange({
                            tier: parseInt(val, 10) as CharacterTier,
                        })
                    }
                />
                <TextInput
                    id="character-current-mp"
                    label="Current MP"
                    numbersOnly={true}
                    value={combatant.character.currentMP.toString()}
                    onChange={(val) => {
                        const parsed = val ? parseInt(val, 10) : 0;
                        handleCharacterChange({ currentMP: isNaN(parsed) ? 0 : parsed });
                    }}
                />
            </div>

            <div className="combatant-editor__section">
                <h3>Position in Formation</h3>
                <div className="combatant-editor__position-row">
                    <Dropdown
                        id="position-x"
                        label="Grid X (Column)"
                        defaultValue={combatant.position.x.toString()}
                        options={posOptions}
                        onOptionSelect={(val) => handlePositionChange('x', val)}
                    />
                    <Dropdown
                        id="position-y"
                        label="Grid Y (Row)"
                        defaultValue={combatant.position.y.toString()}
                        options={posOptions}
                        onOptionSelect={(val) => handlePositionChange('y', val)}
                    />
                </div>
            </div>

            <div className="combatant-editor__section">
                <h3>Base Stats</h3>
                <div className="combatant-editor__stats-grid">
                    {Object.values(BaseStatNames).map((statName) => (
                        <TextInput
                            key={statName}
                            id={`stat-${statName}`}
                            label={statName}
                            numbersOnly={true}
                            value={combatant.character.stats[statName]?.toString() ?? '0'}
                            onChange={(val) => handleStatChange(statName, val)}
                        />
                    ))}
                </div>
            </div>

            <div className="combatant-editor__section">
                <div className="combatant-editor__header">
                    <h3>Abilities ({combatant.character.abilities.length})</h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button onClick={handleAddAttackAbility}>Add Attack</Button>
                        <Button onClick={handleAddAbility}>Add Custom</Button>
                    </div>
                </div>

                {combatant.character.abilities.map((ability, index) => (
                    <div
                        key={ability.pointEffects[0]?.id ?? `${ability.name}-${ability.cost}`}
                        className="combatant-editor__ability-item"
                    >
                        <TextInput
                            id={`ability-name-${index}`}
                            label="Ability Name"
                            value={ability.name}
                            onChange={(val) =>
                                handleAbilityChange(index, { name: val ?? '' })
                            }
                        />
                        <TextInput
                            id={`ability-cost-${index}`}
                            label="MP Cost"
                            numbersOnly={true}
                            value={ability.cost.toString()}
                            onChange={(val) => {
                                const parsed = val ? parseInt(val, 10) : 0;
                                handleAbilityChange(index, {
                                    cost: isNaN(parsed) ? 0 : parsed,
                                });
                            }}
                        />
                        <Button
                            buttonTheme={ButtonTheme.Delete}
                            onClick={() => handleRemoveAbility(index)}
                        >
                            Remove
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
