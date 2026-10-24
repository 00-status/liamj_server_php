import { render, fireEvent } from '@testing-library/react';
import { Children } from 'react';

import MonsterFormationEditorPage from './MonsterFormationEditorPage';

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

    it('allows editing currentHP and currentMP, and keeps name read-only', () => {
        const { getByText, getByLabelText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const nameInput = getByLabelText('Name (from Template)') as HTMLInputElement;
        expect(nameInput).toHaveAttribute('readonly');

        const hpInput = getByLabelText('Current HP') as HTMLInputElement;
        fireEvent.change(hpInput, { target: { value: '75' } });
        expect(hpInput.value).toBe('75');

        const mpInput = getByLabelText('Current MP') as HTMLInputElement;
        fireEvent.change(mpInput, { target: { value: '15' } });
        expect(mpInput.value).toBe('15');
    });

    it('allows applying a character template from dropdown', () => {
        const { getByText, getByLabelText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const templateSelect = getByLabelText('Apply Template') as HTMLSelectElement;
        // exampleMonsters[0] is Skeleton
        fireEvent.change(templateSelect, { target: { value: templateSelect.options[1].value } });

        expect(getByText('Skeleton')).toBeInTheDocument();
    });

    it('keeps ID read-only and does not expose modifiers', () => {
        const { getByText, getByLabelText, queryByLabelText } = render(
            <MonsterFormationEditorPage />,
        );

        fireEvent.click(getByText('Add Formation'));

        const idInput = getByLabelText('Combatant ID (Read Only)') as HTMLInputElement;
        expect(idInput).toHaveAttribute('readonly');

        expect(queryByLabelText('Modifiers')).not.toBeInTheDocument();
    });

    it('can delete a monster combatant from formation', () => {
        const { getByText, queryByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const deleteMonsterBtn = getByText('Delete Monster');
        fireEvent.click(deleteMonsterBtn);

        expect(queryByText('Monster 1')).not.toBeInTheDocument();
        expect(
            getByText('Select a monster from the grid above to edit its stats or abilities.'),
        ).toBeInTheDocument();
    });

    it('can export formations as JSON', () => {
        const { getByText } = render(<MonsterFormationEditorPage />);

        fireEvent.click(getByText('Add Formation'));

        const exportBtn = getByText('Export Formations JSON');
        fireEvent.click(exportBtn);

        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
});
