import { render } from '@testing-library/react';
import { Children } from 'react';

import AboutMe from './AboutMe';

jest.mock('../SharedComponents/Page/Page', () => {
    return {
        Page: ({ children }: { children: typeof Children }) => <>{children}</>,
    };
});

describe('AboutMe', () => {
    it('should render the paragraphs section', () => {
        const { getByText, getAllByText } = render(<AboutMe />);

        getAllByText('About Me');
        getByText("Hey, I'm Liam Johnson. Welcome! Have a seat. Take a look around.");
    });

    it('should render a lilst of skills', () => {
        const { getByText } = render(<AboutMe />);

        getByText('React');
        getByText('TypeScript');
        getByText('Flow');
        getByText('Vue');
        getByText('Webpack');
    });
});
