import type { ReactElement } from 'react';

import { MonsterCombatant } from '../../../domain/Combatant';
import type { Character } from '../../../domain/types';
import { TextInput } from '../../../../SharedComponents/TextInput/TextInput';
import { Dropdown } from '../../../../SharedComponents/Dropdown/Dropdown';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';

import './combatant-editor.css';

interface CombatantEditorProps {
    combatant: MonsterCombatant;
    characterTemplates: Character[];
    onChange: (updatedCombatant: MonsterCombatant) => void;
    onDelete: (combatantId: string) => void;
}

export const CombatantEditor = ({
    combatant,
    characterTemplates,
    onChange,
    onDelete,
}: CombatantEditorProps): ReactElement => {
    const handleCharacterFieldChange = (fields: Partial<Character>) => {
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

    const handleApplyTemplate = (templateId: string) => {
        const template = characterTemplates.find((t) => t.id === templateId);
        if (!template) return;

        const clonedCharacter: Character = {
            ...structuredClone(template),
            id: crypto.randomUUID(),
            currentHP: template.stats.healthPoints,
            currentMP: template.currentMP,
        };

        const updated = new MonsterCombatant(
            combatant.id,
            clonedCharacter,
            combatant.position,
            combatant.turnsUntilAction,
            combatant.critBag,
        );
        onChange(updated);
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

    const posOptions = [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
    ];

    const templateOptions = [
        { label: '-- Select a Template --', value: '' },
        ...characterTemplates.map((template) => ({
            label: `${template.name} (Tier ${template.tier})`,
            value: template.id,
        })),
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
                <h3>Template</h3>
                {characterTemplates.length > 0 ? (
                    <Dropdown
                        id="character-template-select"
                        label="Apply Template"
                        defaultValue=""
                        options={templateOptions}
                        onOptionSelect={handleApplyTemplate}
                    />
                ) : (
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        No character templates loaded. Upload templates to apply them
                        here.
                    </p>
                )}
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
                <h3>Health & Mana</h3>
                <TextInput
                    id="character-current-hp"
                    label="Current HP"
                    numbersOnly={true}
                    value={combatant.character.currentHP.toString()}
                    onChange={(val) => {
                        const parsed = val ? parseInt(val, 10) : 0;
                        handleCharacterFieldChange({
                            currentHP: isNaN(parsed) ? 0 : parsed,
                        });
                    }}
                />
                <TextInput
                    id="character-current-mp"
                    label="Current MP"
                    numbersOnly={true}
                    value={combatant.character.currentMP.toString()}
                    onChange={(val) => {
                        const parsed = val ? parseInt(val, 10) : 0;
                        handleCharacterFieldChange({
                            currentMP: isNaN(parsed) ? 0 : parsed,
                        });
                    }}
                />
            </div>

            <div className="combatant-editor__section">
                <h3>Character Details (Template)</h3>
                <TextInput
                    id="combatant-id"
                    label="Combatant ID (Read Only)"
                    value={combatant.id}
                    readonly={true}
                />
                <TextInput
                    id="character-name"
                    label="Name (from Template)"
                    value={combatant.character.name}
                    readonly={true}
                />
                <TextInput
                    id="character-tier"
                    label="Tier"
                    value={`Tier ${combatant.character.tier}`}
                    readonly={true}
                />
                <div className="combatant-editor__stats-grid" style={{ marginTop: '0.5rem' }}>
                    <div>
                        <strong>Max HP:</strong> {combatant.character.stats.healthPoints}
                    </div>
                    <div>
                        <strong>Max MP:</strong> {combatant.character.stats.magicPoints}
                    </div>
                    <div>
                        <strong>Attack:</strong> {combatant.character.stats.attack}
                    </div>
                    <div>
                        <strong>M. Attack:</strong>{' '}
                        {combatant.character.stats.magicAttack}
                    </div>
                    <div>
                        <strong>Defence:</strong> {combatant.character.stats.defence}
                    </div>
                    <div>
                        <strong>M. Defence:</strong>{' '}
                        {combatant.character.stats.magicDefence}
                    </div>
                </div>
                <div style={{ marginTop: '0.75rem' }}>
                    <strong>Abilities:</strong>{' '}
                    {combatant.character.abilities.length === 0
                        ? 'None'
                        : combatant.character.abilities.map((a) => a.name).join(', ')}
                </div>
            </div>
        </div>
    );
};
