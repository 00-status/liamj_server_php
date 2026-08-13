import { render } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import * as GTAG from 'ga-gtag';

import { Page } from './Page';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    return {
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/' }),
    };
});

describe('Page', () => {
    const mockGtag = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(GTAG, 'gtag').mockImplementation(mockGtag);
    });

    it('should render vertical nav container', () => {
        const { getByText } = render(
            <Page title="Test" routes={[]}>
                Banana
            </Page>,
        );

        getByText('Landing');
        getByText('D&D Tools');
        getByText('RPG Tools');
        getByText('Terminal');
    });

    it('should render the contents', () => {
        const { getByText } = render(
            <Page title="Test" routes={[{ route: '/', label: 'banana_page' }]}>
                Banana
            </Page>,
        );

        getByText('Banana');
        expect(mockGtag).toHaveBeenCalledTimes(1);
        expect(mockGtag).toHaveBeenCalledWith('event', 'page_view', {
            page_location: '/',
            page_title: 'banana_page',
        });
    });

    it('should render the passed in title', () => {
        const { getByText } = render(
            <Page title="This is a test title" routes={[]}>
                Test
            </Page>,
        );

        getByText('This is a test title');
    });

    it('should render the passed in footer', () => {
        const footer = <>TEST FOOTER!</>;
        const { getByText } = render(
            <Page title="title" footer={footer} routes={[]}>
                Test
            </Page>,
        );

        getByText('TEST FOOTER!');
    });

    it('should switch to new route when clicking nav item', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({ delay: null });

        const routes = [
            { label: 'Test Route', route: '/test_path' },
            { label: 'Test Route 2', route: '/test_path_2' },
        ];
        const { getByText } = render(
            <Page title="" routes={routes}>
                Test
            </Page>,
        );

        expect(mockNavigate).toHaveBeenCalledTimes(0);

        await user.click(getByText('Test Route 2'));
        jest.runAllTimers();

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith('/test_path_2');

        jest.useRealTimers();
    });

    it('should render home icon when home flag is true', async () => {
        const routes = [{ label: 'Test Route', route: '/test_path', isHomeLink: true }];
        const { getByTitle } = render(
            <Page title="" routes={routes}>
                Test
            </Page>,
        );

        getByTitle('Home');
    });

    it('should NOT navigate when clicking the current nav item', async () => {
        jest.useFakeTimers();
        const user = userEvent.setup({ delay: null });

        const routes = [
            { label: 'Test Route Root', route: '/' },
            { label: 'Test Route 2', route: '/test_path_2' },
        ];
        const { getByText } = render(
            <Page title="Title" routes={routes}>
                Test
            </Page>,
        );

        await user.click(getByText('Test Route Root'));
        jest.runAllTimers();

        expect(mockNavigate).toHaveBeenCalledTimes(0);

        jest.useRealTimers();
    });
});
