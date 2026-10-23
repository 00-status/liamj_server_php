import { render, fireEvent } from '@testing-library/react';
import { Children } from 'react';

import { MonsterCombatant } from '../../domain/Combatant';

import MonsterFormationEditorPage from './MonsterFormationEditorPage';
import { deserializeFormations } from './domain';

jest.mock('../../../SharedComponents/Page/Page', () => {
    return {
        Page: ({ children }: { children: typeof Children }) => <>{children}</>,
    };
});

describe('MonsterFormationEditorPage', () => {
    beforeEach(() => {
        window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
        window.URL.revokeObjectURL = jest.fn();
    });

    it('renders initial empty state', () => {
        const { getByText } = render(<MonsterFormationEditorPage />);

        expect(
            getByText('No formations loaded. Upload a file or add a new formation.'),
        ).toBeInTheDocument();
        expect(getByText('Select or create a formation to edit.')).toBeInTheDocument();
    });

    it('can create a new formation with default monster combatant', () => {
        const { getByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        expect(getByText('Formations (1)')).toBeInTheDocument();
        expect(getByText('Formation Grid (3x3)')).toBeInTheDocument();
        expect(getByText('Edit Monster Combatant')).toBeInTheDocument();
        expect(getByText('Monster 1')).toBeInTheDocument();
    });

    it('can add a monster at an empty grid cell', () => {
        const { getByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const addCellBtn = getByText('+ Add (2, 2)');
        fireEvent.click(addCellBtn);

        expect(getByText('Monster (2, 2)')).toBeInTheDocument();
    });

    it('allows editing character name, tier, MP, and stats', () => {
        const { getByText, getByLabelText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const nameInput = getByLabelText('Character Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Goblin Warlord' } });

        expect(getByText('Goblin Warlord')).toBeInTheDocument();

        const mpInput = getByLabelText('Current MP') as HTMLInputElement;
        fireEvent.change(mpInput, { target: { value: '15' } });
        expect(mpInput.value).toBe('15');

        const atkInput = getByLabelText('attack') as HTMLInputElement;
        fireEvent.change(atkInput, { target: { value: '45' } });
        expect(atkInput.value).toBe('45');
    });

    it('keeps ID read-only and does not expose currentHP or modifiers', () => {
        const { getByText, getByLabelText, queryByLabelText } = render(
            <MonsterFormationEditorPage />,
        );

        fireEvent.click(getByText('Add Formation'));

        const idInput = getByLabelText('Combatant ID (Read Only)') as HTMLInputElement;
        expect(idInput).toHaveAttribute('readonly');

        expect(queryByLabelText('Current HP')).not.toBeInTheDocument();
        expect(queryByLabelText('Modifiers')).not.toBeInTheDocument();
    });

    it('can delete a monster combatant from formation', () => {
        const { getByText, queryByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const deleteMonsterBtn = getByText('Delete Monster');
        fireEvent.click(deleteMonsterBtn);

        expect(queryByText('Monster 1')).not.toBeInTheDocument();
        expect(
            getByText(
                'Select a monster from the grid above to edit its stats or abilities.',
            ),
        ).toBeInTheDocument();
    });

    it('can export formations as JSON', () => {
        const { getByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const exportBtn = getByText('Export Formations JSON');
        fireEvent.click(exportBtn);

        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });

    it('deserializes raw JSON into MonsterCombatant class instances', () => {
        const rawJson = [
            {
                id: 'form-1',
                team: 'MONSTER',
                gridDimensions: { x: 3, y: 3 },
                combatants: [
                    {
                        id: 'comb-1',
                        character: {
                            id: 'char-1',
                            name: 'Bespoke Dragon',
                            tier: 4,
                            currentHP: 300,
                            currentMP: 50,
                            stats: { healthPoints: 300, magicPoints: 50 },
                        },
                        position: { x: 2, y: 2 },
                        turnsUntilAction: 1,
                        critBag: [true, false],
                    },
                ],
            },
        ];

        const deserialized = deserializeFormations(rawJson);
        expect(deserialized.length).toBe(1);
        expect(deserialized[0].combatants[0]).toBeInstanceOf(MonsterCombatant);
        expect(deserialized[0].combatants[0].character.name).toBe('Bespoke Dragon');
        expect(deserialized[0].combatants[0].rollCrit(100)).toBe(true);
    });
});
