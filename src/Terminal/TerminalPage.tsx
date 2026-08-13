import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { gtag } from 'ga-gtag';

import './terminal-page.css';
import { Icon } from '../SharedComponents/Icon/Icon';
import { IconTheme, IconType } from '../SharedComponents/Icon/domain';

import { Terminal } from './Terminal';
import { CodeBlockGenerator } from './CodeBlockGenerator';
import { useServers } from './hooks/server/useServers';
import { useDirectories } from './hooks/directories/useDirectories';
import { TerminalLoader } from './TerminalLoader';

const TerminalPage = () => {
    const navigate = useNavigate();

    document.title = 'Terminal';

    useEffect(() => {
        gtag('event', 'page_view', {
            page_location: '/terminal',
            page_title: 'Terminal',
        });
    }, [gtag]);

    const [codeBlockKeys, setCodeBlockKeys] = useState<Array<number | string>>([
        ...Array(10).keys(),
    ]);
    const { servers, fetchServers } = useServers();
    const { directories, fetchDirectories } = useDirectories();

    useEffect(() => {
        if (servers.length === 0) {
            fetchServers();
        }

        if (servers.length > 0) {
            fetchDirectories(servers[0].id);
        }
    }, [servers, fetchServers, fetchDirectories]);

    return (
        <div className="terminal-page">
            <div className="terminal-page__header">
                <h1 className="terminal-page__title">Terminal</h1>
                <div className="terminal-page__nav">
                    <a className="terminal-page__link" onClick={() => navigate('/')}>
                        <Icon iconType={IconType.HOME} iconTheme={IconTheme.GREEN} />
                        Landing
                    </a>
                    <a
                        className="terminal-page__link terminal-page__link--active"
                        onClick={() => navigate('#')}
                    >
                        Terminal
                    </a>
                </div>
            </div>
            <div className="terminal-page__content">
                <div className="terminal-page__background">
                    {codeBlockKeys.map((value: number | string) => (
                        <CodeBlockGenerator key={'code-block-' + value} />
                    ))}
                </div>
                <div className="terminal-page__foreground">
                    {servers.length !== 0 && directories.length !== 0 ? (
                        <Terminal
                            servers={servers}
                            directories={directories}
                            fetchDirectories={fetchDirectories}
                            onEnteredCommand={() => changeKey(codeBlockKeys, setCodeBlockKeys)}
                        />
                    ) : (
                        <TerminalLoader />
                    )}
                </div>
            </div>
        </div>
    );
};

const changeKey = (
    array: Array<number | string>,
    setArray: (newArray: Array<number | string>) => void,
) => {
    const arrayCopy = [...array];
    const arrayLength = arrayCopy.length;

    const indexToChange = Math.floor(Math.random() * (arrayLength - 1 + 1) + 1);

    arrayCopy[indexToChange] = crypto.randomUUID();

    setArray(arrayCopy);
};

export default TerminalPage;
