import type { ReactElement } from 'react';

import type {
    Ability,
    BaseStats,
    Character,
    CharacterTier,
    PointEffect,
    StatusEffect} from '../../../domain/types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    DamageScaleMethod,
    DamageType,
    TargetScope,
} from '../../../domain/types';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { Dropdown } from '../../../../SharedComponents/Dropdown/Dropdown';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';

import './character-editor.css';

interface CharacterEditorProps {
    character: Character;
    onChange: (updatedCharacter: Character) => void;
    onDelete: (characterId: string) => void;
}

export const CharacterEditor = ({
    character,
    onChange,
    onDelete,
}: CharacterEditorProps): ReactElement => {
    const handleFieldChange = (fields: Partial<Character>) => {
        onChange({
            ...character,
            ...fields,
        });
    };

    const handleStatChange = (statName: keyof BaseStats, valueString?: string) => {
        const parsed = valueString ? parseFloat(valueString) : 0;
        const newStats: BaseStats = {
            ...character.stats,
            [statName]: isNaN(parsed) ? 0 : parsed,
        };

        handleFieldChange({ stats: newStats });
    };

    const handleAddAbility = () => {
        const newAbility: Ability = {
            name: 'New Ability',
            cost: 1,
            type: AbilityType.skill,
            abilityTarget: AbilityTarget.OPPONENT_FORMATION,
            pointEffects: [
                {
                    id: crypto.randomUUID(),
                    name: 'Damage',
                    target: TargetScope.target,
                    damageType: DamageType.PHYSICAL,
                    power: 1.0,
                    duration: 0,
                },
            ],
            statusEffects: [],
        };

        handleFieldChange({
            abilities: [...character.abilities, newAbility],
        });
    };

    const handleRemoveAbility = (abilityIndex: number) => {
        handleFieldChange({
            abilities: character.abilities.filter((_, i) => i !== abilityIndex),
        });
    };

    const handleUpdateAbility = (abilityIndex: number, updatedFields: Partial<Ability>) => {
        handleFieldChange({
            abilities: character.abilities.map((ability, i) => {
                if (i === abilityIndex) {
                    return { ...ability, ...updatedFields };
                }
                return ability;
            }),
        });
    };

    const handleAddPointEffect = (abilityIndex: number) => {
        const currentAbility = character.abilities[abilityIndex];
        const newEffect: PointEffect = {
            id: crypto.randomUUID(),
            name: 'New Point Effect',
            target: TargetScope.target,
            damageType: DamageType.PHYSICAL,
            power: 1.0,
            duration: 0,
        };

        handleUpdateAbility(abilityIndex, {
            pointEffects: [...currentAbility.pointEffects, newEffect],
        });
    };

    const handleUpdatePointEffect = (
        abilityIndex: number,
        effectId: string,
        fields: Partial<PointEffect>,
    ) => {
        const currentAbility = character.abilities[abilityIndex];
        handleUpdateAbility(abilityIndex, {
            pointEffects: currentAbility.pointEffects.map((effect) =>
                effect.id === effectId ? { ...effect, ...fields } : effect,
            ),
        });
    };

    const handleRemovePointEffect = (abilityIndex: number, effectId: string) => {
        const currentAbility = character.abilities[abilityIndex];
        handleUpdateAbility(abilityIndex, {
            pointEffects: currentAbility.pointEffects.filter((effect) => effect.id !== effectId),
        });
    };

    const handleAddStatusEffect = (abilityIndex: number) => {
        const currentAbility = character.abilities[abilityIndex];
        const newEffect: StatusEffect = {
            id: crypto.randomUUID(),
            name: 'New Status Effect',
            target: TargetScope.target,
            duration: 2,
            stat: BaseStatNames.defence,
            value: -5,
            damageScaleType: DamageScaleMethod.FLAT,
        };

        handleUpdateAbility(abilityIndex, {
            statusEffects: [...currentAbility.statusEffects, newEffect],
        });
    };

    const handleUpdateStatusEffect = (
        abilityIndex: number,
        effectId: string,
        fields: Partial<StatusEffect>,
    ) => {
        const currentAbility = character.abilities[abilityIndex];
        handleUpdateAbility(abilityIndex, {
            statusEffects: currentAbility.statusEffects.map((effect) =>
                effect.id === effectId ? { ...effect, ...fields } : effect,
            ),
        });
    };

    const handleRemoveStatusEffect = (abilityIndex: number, effectId: string) => {
        const currentAbility = character.abilities[abilityIndex];
        handleUpdateAbility(abilityIndex, {
            statusEffects: currentAbility.statusEffects.filter((effect) => effect.id !== effectId),
        });
    };

    const tierOptions = [
        { label: 'Tier 1', value: '1' },
        { label: 'Tier 2', value: '2' },
        { label: 'Tier 3', value: '3' },
        { label: 'Tier 4', value: '4' },
    ];

    const abilityTypeOptions = Object.values(AbilityType).map((type) => ({
        label: type,
        value: type,
    }));

    const abilityTargetOptions = Object.values(AbilityTarget).map((target) => ({
        label: target,
        value: target,
    }));

    const targetScopeOptions = Object.values(TargetScope).map((scope) => ({
        label: scope,
        value: scope,
    }));

    const damageTypeOptions = Object.values(DamageType).map((type) => ({
        label: type,
        value: type,
    }));

    const statOptions = Object.values(BaseStatNames).map((stat) => ({
        label: stat,
        value: stat,
    }));

    const damageScaleMethodOptions = Object.values(DamageScaleMethod).map((method) => ({
        label: method,
        value: method,
    }));

    return (
        <div className="character-editor">
            <div className="character-editor__header">
                <h2>Edit Character Template</h2>
                <Button buttonTheme={ButtonTheme.Delete} onClick={() => onDelete(character.id)}>
                    Delete Character
                </Button>
            </div>

            <div className="character-editor__section">
                <h3>Identity</h3>
                <TextInput
                    id="char-id"
                    label="Character ID (Read Only)"
                    value={character.id}
                    readonly={true}
                />
                <TextInput
                    id="char-name"
                    label="Character Name"
                    value={character.name}
                    onChange={(val) => handleFieldChange({ name: val ?? '' })}
                />
                <Dropdown
                    id="char-tier"
                    label="Tier"
                    defaultValue={character.tier.toString()}
                    options={tierOptions}
                    onOptionSelect={(val) =>
                        handleFieldChange({ tier: parseInt(val, 10) as CharacterTier })
                    }
                />
                <TextInput
                    id="char-current-mp"
                    label="Current MP"
                    numbersOnly={true}
                    value={character.currentMP.toString()}
                    onChange={(val) => {
                        const parsed = val ? parseInt(val, 10) : 0;
                        handleFieldChange({ currentMP: isNaN(parsed) ? 0 : parsed });
                    }}
                />
            </div>

            <div className="character-editor__section">
                <h3>Base Stats</h3>
                <div className="character-editor__stats-grid">
                    {Object.values(BaseStatNames).map((statName) => (
                        <TextInput
                            key={statName}
                            id={`stat-${statName}`}
                            label={statName}
                            numbersOnly={true}
                            value={character.stats[statName]?.toString() ?? '0'}
                            onChange={(val) => handleStatChange(statName, val)}
                        />
                    ))}
                </div>
            </div>

            <div className="character-editor__section">
                <div className="character-editor__header">
                    <h3>Abilities ({character.abilities.length})</h3>
                    <Button onClick={handleAddAbility}>Add Ability</Button>
                </div>

                {character.abilities.map((ability, abilityIndex) => {
                    const abilityKey =
                        ability.pointEffects[0]?.id ??
                        ability.statusEffects[0]?.id ??
                        `${ability.name}-${ability.cost}`;

                    return (
                        <div key={abilityKey} className="character-editor__ability-card">
                            <div className="character-editor__ability-header">
                                <h4>{ability.name || 'Unnamed Ability'}</h4>
                                <Button
                                    buttonTheme={ButtonTheme.Delete}
                                    onClick={() => handleRemoveAbility(abilityIndex)}
                                >
                                    Delete Ability
                                </Button>
                            </div>

                            <div className="character-editor__ability-main-fields">
                                <TextInput
                                    id={`ability-name-${abilityIndex}`}
                                    label="Ability Name"
                                    value={ability.name}
                                    onChange={(val) =>
                                        handleUpdateAbility(abilityIndex, {
                                            name: val ?? '',
                                        })
                                    }
                                />
                                <TextInput
                                    id={`ability-cost-${abilityIndex}`}
                                    label="MP Cost"
                                    numbersOnly={true}
                                    value={ability.cost.toString()}
                                    onChange={(val) => {
                                        const parsed = val ? parseInt(val, 10) : 0;
                                        handleUpdateAbility(abilityIndex, {
                                            cost: isNaN(parsed) ? 0 : parsed,
                                        });
                                    }}
                                />
                                <Dropdown
                                    id={`ability-type-${abilityIndex}`}
                                    label="Type"
                                    defaultValue={ability.type}
                                    options={abilityTypeOptions}
                                    onOptionSelect={(val) =>
                                        handleUpdateAbility(abilityIndex, {
                                            type: val as AbilityType,
                                        })
                                    }
                                />
                                <Dropdown
                                    id={`ability-target-${abilityIndex}`}
                                    label="Target Formation"
                                    defaultValue={ability.abilityTarget}
                                    options={abilityTargetOptions}
                                    onOptionSelect={(val) =>
                                        handleUpdateAbility(abilityIndex, {
                                            abilityTarget: val as AbilityTarget,
                                        })
                                    }
                                />
                            </div>

                            {/* Point Effects */}
                            <div className="character-editor__effects-group">
                                <div className="character-editor__effects-header">
                                    <h5>Point Effects ({ability.pointEffects.length})</h5>
                                    <Button onClick={() => handleAddPointEffect(abilityIndex)}>
                                        + Add Point Effect
                                    </Button>
                                </div>
                                {ability.pointEffects.map((effect) => (
                                    <div key={effect.id} className="character-editor__effect-row">
                                        <TextInput
                                            id={`pe-name-${effect.id}`}
                                            label="Effect Name"
                                            value={effect.name}
                                            onChange={(val) =>
                                                handleUpdatePointEffect(abilityIndex, effect.id, {
                                                    name: val ?? '',
                                                })
                                            }
                                        />
                                        <Dropdown
                                            id={`pe-target-${effect.id}`}
                                            label="Scope"
                                            defaultValue={effect.target}
                                            options={targetScopeOptions}
                                            onOptionSelect={(val) =>
                                                handleUpdatePointEffect(abilityIndex, effect.id, {
                                                    target: val as TargetScope,
                                                })
                                            }
                                        />
                                        <Dropdown
                                            id={`pe-type-${effect.id}`}
                                            label="Damage Type"
                                            defaultValue={effect.damageType}
                                            options={damageTypeOptions}
                                            onOptionSelect={(val) =>
                                                handleUpdatePointEffect(abilityIndex, effect.id, {
                                                    damageType: val as DamageType,
                                                })
                                            }
                                        />
                                        <TextInput
                                            id={`pe-power-${effect.id}`}
                                            label="Power (Multiplier)"
                                            numbersOnly={true}
                                            value={effect.power.toString()}
                                            onChange={(val) => {
                                                const parsed = val ? parseFloat(val) : 0;
                                                handleUpdatePointEffect(abilityIndex, effect.id, {
                                                    power: isNaN(parsed) ? 0 : parsed,
                                                });
                                            }}
                                        />
                                        <TextInput
                                            id={`pe-duration-${effect.id}`}
                                            label="Duration"
                                            numbersOnly={true}
                                            value={effect.duration.toString()}
                                            onChange={(val) => {
                                                const parsed = val ? parseInt(val) : 0;
                                                handleUpdatePointEffect(abilityIndex, effect.id, {
                                                    duration: isNaN(parsed) ? 0 : parsed,
                                                });
                                            }}
                                        />
                                        <Button
                                            buttonTheme={ButtonTheme.Delete}
                                            onClick={() =>
                                                handleRemovePointEffect(abilityIndex, effect.id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {/* Status Effects */}
                            <div className="character-editor__effects-group">
                                <div className="character-editor__effects-header">
                                    <h5>Status Effects ({ability.statusEffects.length})</h5>
                                    <Button onClick={() => handleAddStatusEffect(abilityIndex)}>
                                        + Add Status Effect
                                    </Button>
                                </div>
                                {ability.statusEffects.map((effect) => (
                                    <div key={effect.id} className="character-editor__effect-row">
                                        <TextInput
                                            id={`se-name-${effect.id}`}
                                            label="Status Effect Name"
                                            value={effect.name}
                                            onChange={(val) =>
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    name: val ?? '',
                                                })
                                            }
                                        />
                                        <Dropdown
                                            id={`se-target-${effect.id}`}
                                            label="Scope"
                                            defaultValue={effect.target}
                                            options={targetScopeOptions}
                                            onOptionSelect={(val) =>
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    target: val as TargetScope,
                                                })
                                            }
                                        />
                                        <Dropdown
                                            id={`se-stat-${effect.id}`}
                                            label="Stat"
                                            defaultValue={effect.stat}
                                            options={statOptions}
                                            onOptionSelect={(val) =>
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    stat: val as keyof BaseStats,
                                                })
                                            }
                                        />
                                        <Dropdown
                                            id={`se-scale-${effect.id}`}
                                            label="Scale"
                                            defaultValue={effect.damageScaleType}
                                            options={damageScaleMethodOptions}
                                            onOptionSelect={(val) =>
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    damageScaleType: val as DamageScaleMethod,
                                                })
                                            }
                                        />
                                        <TextInput
                                            id={`se-value-${effect.id}`}
                                            label="Value"
                                            numbersOnly={true}
                                            value={effect.value.toString()}
                                            onChange={(val) => {
                                                const parsed = val ? parseFloat(val) : 0;
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    value: isNaN(parsed) ? 0 : parsed,
                                                });
                                            }}
                                        />
                                        <TextInput
                                            id={`se-dur-${effect.id}`}
                                            label="Duration"
                                            numbersOnly={true}
                                            value={effect.duration.toString()}
                                            onChange={(val) => {
                                                const parsed = val ? parseInt(val, 10) : 0;
                                                handleUpdateStatusEffect(abilityIndex, effect.id, {
                                                    duration: isNaN(parsed) ? 0 : parsed,
                                                });
                                            }}
                                        />
                                        <Button
                                            buttonTheme={ButtonTheme.Delete}
                                            onClick={() =>
                                                handleRemoveStatusEffect(abilityIndex, effect.id)
                                            }
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
