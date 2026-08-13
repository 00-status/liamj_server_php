import { ReactNode } from 'react';

import './button-link.css';

type Props = {
    download: string;
    href: string;
    children: ReactNode;
};

export const ButtonLink = (props: Props) => {
    return (
        <a className="button-link" download={props.download} href={props.href}>
            {props.children}
        </a>
    );
};
