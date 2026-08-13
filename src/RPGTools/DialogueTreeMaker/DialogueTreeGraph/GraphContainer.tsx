import { SigmaContainer } from '@react-sigma/core';
import { ReactNode } from 'react';

import { defaultCircleDrawHover } from './DefaultDrawHover';
import { CustomNodeSquareProgram } from './CustomNodeSquareProgram';

const sigmaSettings = {
    allowInvalidContainer: true,
    nodeProgramClasses: { square: CustomNodeSquareProgram },
    defaultEdgeType: 'arrow',
    defaultDrawNodeHover: defaultCircleDrawHover,
};

type Props = {
    children: ReactNode;
};

export const GraphContainer = (props: Props) => {
    const { children } = props;

    return (
        <SigmaContainer
            settings={sigmaSettings}
            style={{ height: '350px', backgroundColor: '#3b3b40', color: '#FCFEFF' }}
        >
            {children}
        </SigmaContainer>
    );
};
