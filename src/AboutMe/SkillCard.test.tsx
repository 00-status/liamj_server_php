import { render } from '@testing-library/react';

import { SkillCard, SkillLevel } from './SkillCard';

describe('SkillCard', () => {
    it('Should render the skill name', () => {
        const { getByText } = render(
            <SkillCard name="Banana" type="Fruit" skillLevel={SkillLevel.expert} />,
        );
        getByText('Banana');
        getByText('Fruit');
    });
});
