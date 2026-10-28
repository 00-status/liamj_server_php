import { render, fireEvent } from '@testing-library/react';
import type { Children } from 'react';

import CharacterEditorPage from './CharacterEditorPage';

jest.mock('../../../SharedComponents/Page/Page', () => {
    return {
        Page: ({ children }: { children: typeof Children }) => <>{children}</>,
    };
});

describe('CharacterEditorPage', () => {
    beforeEach(() => {
        window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
        window.URL.revokeObjectURL = jest.fn();
    });

    it('renders initial empty state', () => {
        const { getByText } = render(<CharacterEditorPage />);

        expect(
            getByText('No character templates loaded. Upload a file or add a new character.'),
        ).toBeInTheDocument();
        expect(
            getByText('Select or create a character template to edit.'),
        ).toBeInTheDocument();
    });

    it('can create and edit a character template', () => {
        const { getByText, getByLabelText } = render(<CharacterEditorPage />);

        fireEvent.click(getByText('Add Character'));

        expect(getByText('Characters (1)')).toBeInTheDocument();
        expect(getByText('Edit Character Template')).toBeInTheDocument();

        const nameInput = getByLabelText('Character Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Ghoul' } });

        expect(getByText('Ghoul')).toBeInTheDocument();

        const mpInput = getByLabelText('Current MP') as HTMLInputElement;
        fireEvent.change(mpInput, { target: { value: '12' } });
        expect(mpInput.value).toBe('12');
    });

    it('allows adding and editing abilities, point effects, and status effects', () => {
        const { getByText, getByLabelText } = render(<CharacterEditorPage />);

        fireEvent.click(getByText('Add Character'));

        // Add ability
        fireEvent.click(getByText('Add Ability'));
        expect(getByText('New Ability')).toBeInTheDocument();

        // Add Point Effect
        fireEvent.click(getByText('+ Add Point Effect'));
        expect(getByText('Point Effects (2)')).toBeInTheDocument();

        // Add Status Effect
        fireEvent.click(getByText('+ Add Status Effect'));
        expect(getByText('Status Effects (1)')).toBeInTheDocument();

        // Edit ability name
        const abilityNameInput = getByLabelText('Ability Name') as HTMLInputElement;
        fireEvent.change(abilityNameInput, { target: { value: 'Claw Slash' } });
        expect(getByText('Claw Slash')).toBeInTheDocument();
    });

    it('can delete abilities and effects', () => {
        const { getByText, getAllByText } = render(<CharacterEditorPage />);

        fireEvent.click(getByText('Add Character'));
        fireEvent.click(getByText('Add Ability'));

        // Point effect has a remove button
        const removeButtons = getAllByText('Remove');
        fireEvent.click(removeButtons[0]);
        expect(getByText('Point Effects (0)')).toBeInTheDocument();

        // Delete ability
        fireEvent.click(getByText('Delete Ability'));
        expect(getByText('Abilities (0)')).toBeInTheDocument();
    });

    it('can export characters list', () => {
        const { getByText } = render(<CharacterEditorPage />);

        fireEvent.click(getByText('Add Character'));

        const exportBtn = getByText('Export Characters JSON');
        fireEvent.click(exportBtn);

        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
});
