import { render, fireEvent } from '@testing-library/react';
import { Children } from 'react';

import DungeonCrawlerEditorPage from './DungeonCrawlerEditorPage';

jest.mock('../../SharedComponents/Page/Page', () => {
    return {
        Page: ({ children }: { children: typeof Children }) => <>{children}</>,
    };
});

describe('DungeonCrawlerEditorPage', () => {
    beforeEach(() => {
        window.URL.createObjectURL = jest.fn(() => 'blob:mock-url');
        window.URL.revokeObjectURL = jest.fn();
    });

    it('renders empty state initially', () => {
        const { getByText } = render(<DungeonCrawlerEditorPage />);

        expect(
            getByText('No equipment loaded. Upload a file or add a new item.'),
        ).toBeInTheDocument();
        expect(getByText('Select or create an equipment item to edit.')).toBeInTheDocument();
    });

    it('can create a new equipment item', () => {
        const { getByText, getByLabelText } = render(<DungeonCrawlerEditorPage />);

        const addButton = getByText('Add Equipment');
        fireEvent.click(addButton);

        expect(getByText('Equipment List (1)')).toBeInTheDocument();
        expect(getByText('Edit Equipment')).toBeInTheDocument();

        const nameInput = getByLabelText('Name') as HTMLInputElement;
        expect(nameInput.value).toBe('New Equipment');
    });

    it('updates equipment name and displays in the sidebar', () => {
        const { getByText, getByLabelText } = render(<DungeonCrawlerEditorPage />);

        fireEvent.click(getByText('Add Equipment'));

        const nameInput = getByLabelText('Name') as HTMLInputElement;
        fireEvent.change(nameInput, { target: { value: 'Excalibur' } });

        expect(getByText('Excalibur')).toBeInTheDocument();
    });

    it('can add and remove modifiers', () => {
        const { getByText, queryByText } = render(<DungeonCrawlerEditorPage />);

        fireEvent.click(getByText('Add Equipment'));

        const addModifierBtn = getByText('Add Modifier');
        fireEvent.click(addModifierBtn);

        expect(getByText('Remove')).toBeInTheDocument();

        const removeBtn = getByText('Remove');
        fireEvent.click(removeBtn);

        expect(queryByText('Remove')).not.toBeInTheDocument();
    });

    it('can delete an equipment item', () => {
        const { getByText, queryByText } = render(<DungeonCrawlerEditorPage />);

        fireEvent.click(getByText('Add Equipment'));
        expect(getByText('Equipment List (1)')).toBeInTheDocument();

        const deleteButton = getByText('Delete Equipment');
        fireEvent.click(deleteButton);

        expect(getByText('Equipment List (0)')).toBeInTheDocument();
        expect(queryByText('Edit Equipment')).not.toBeInTheDocument();
    });

    it('can trigger export of equipment list', () => {
        const { getByText } = render(<DungeonCrawlerEditorPage />);

        fireEvent.click(getByText('Add Equipment'));

        const exportBtn = getByText('Export Equipment JSON');
        fireEvent.click(exportBtn);

        expect(window.URL.createObjectURL).toHaveBeenCalledTimes(1);
    });
});
