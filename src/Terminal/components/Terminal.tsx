import { useEffect, useRef, useState } from 'react';
import { gtag } from 'ga-gtag';

import './terminal.css';
import { Command, IHandler, validCommands } from '../domain/types';
import { findNextFileSystemObject } from '../domain/findNextFileSystemObject';
import { Server } from '../hooks/server/useServers';
import { Directory } from '../hooks/directories/useDirectories';

import { TerminalInput } from './TerminalInput';
import { TerminalLoader } from './TerminalLoader';

type Output = {
    id: string;
    output: string;
};

export type TerminalState = {
    servers: Array<Server>;
    currentServer: Server;
    directories: Array<Directory>;
    currentDirectory: Directory | null;
    commandHistory: Array<Command>;
    outputs: Array<Output>;
};

type Props = {
    servers: Array<Server>;
    directories: Array<Directory>;
    fetchDirectories: (serverId: number) => void;
    onEnteredCommand: () => void;
};

export const Terminal = ({ servers, directories, fetchDirectories, onEnteredCommand }: Props) => {
    const [commandHistoryIndex, setCommandHistoryIndex] = useState<number | null>(null);
    const [currentCommand, setCurrentCommand] = useState<string>('');
    const outputRef = useRef<HTMLDivElement | null>(null);

    const [terminal, setTerminal] = useState<TerminalState>({
        servers: servers,
        currentServer: servers[0],
        directories: directories,
        currentDirectory: directories[0],
        commandHistory: [],
        outputs: [
            { id: crypto.randomUUID(), output: 'Welcome. Type "help" for a list of commands' },
        ],
    });

    useEffect(() => {
        if (!terminal.currentDirectory) {
            fetchDirectories(terminal.currentServer.id);
        }
    }, [terminal.currentDirectory]);

    useEffect(() => {
        const currentDirectory = directories[0];
        setTerminal((terminalState) => {
            return {
                ...terminalState,
                directories,
                currentDirectory,
                outputs: [
                    ...terminalState.outputs,
                    {
                        id: crypto.randomUUID(),
                        output: '\nSuccessfully connected to: ' + terminalState.currentServer.name,
                    },
                ],
            };
        });
    }, [directories, setTerminal]);

    useEffect(() => {
        if (outputRef.current) {
            outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
    }, [outputRef, terminal.outputs]);

    const onArrowUp = () => {
        const history = terminal.commandHistory;
        const historyLength = history.length;

        if (commandHistoryIndex === historyLength - 1) {
            return;
        }

        const index = commandHistoryIndex === null ? 0 : commandHistoryIndex;
        const command = history[index] ?? null;

        if (!command) {
            return;
        }

        setCurrentCommand(command.text);
        setCommandHistoryIndex(index + 1);
    };

    const onArrowDown = () => {
        const history = terminal.commandHistory;

        if (commandHistoryIndex === null) {
            return;
        }

        const command = history[commandHistoryIndex] ?? null;

        if (!command) {
            return;
        }

        setCurrentCommand(command.text);
        setCommandHistoryIndex(commandHistoryIndex - 1);
    };

    const commandPrefix =
        terminal.currentServer.name + '@' + (terminal?.currentDirectory?.name ?? '') + '% ';

    return (
        <div className="terminal">
            <div className="terminal__output-wrapper" ref={outputRef}>
                {terminal.outputs.map((output) => (
                    <div className="terminal__output" key={output.id}>
                        {output.output}
                    </div>
                ))}
            </div>
            {!terminal.currentDirectory && <TerminalLoader />}
            {terminal.currentDirectory && (
                <TerminalInput
                    prefixText={commandPrefix}
                    currentCommandText={currentCommand}
                    onChange={(newValue) => setCurrentCommand(newValue)}
                    onEnter={() => {
                        onEnteredCommand();

                        const commandResult = executeCommand(terminal, setTerminal, currentCommand);

                        setTerminal((state) => {
                            return {
                                ...state,
                                outputs: [
                                    ...terminal.outputs,
                                    {
                                        id: crypto.randomUUID(),
                                        output: commandPrefix + currentCommand,
                                    },
                                    { id: crypto.randomUUID(), output: commandResult },
                                ],
                                commandHistory: [
                                    ...terminal.commandHistory,
                                    { id: crypto.randomUUID(), text: currentCommand },
                                ],
                            };
                        });

                        setCurrentCommand('');
                    }}
                    onTab={() => {
                        const currentDirectory = terminal.currentDirectory;

                        if (currentDirectory) {
                            const nextFSO = findNextFileSystemObject(
                                currentCommand,
                                terminal.directories,
                                currentDirectory,
                            );

                            setCurrentCommand(nextFSO);
                        }
                    }}
                />
            )}
        </div>
    );
};

const executeCommand = (
    terminal: TerminalState,
    setTerminal: (terminalState: TerminalState) => void,
    currentCommand: string,
): string => {
    const textCommand = currentCommand.split(' ');
    const command: IHandler | undefined = validCommands.get(textCommand[0]?.toLowerCase());

    if (!command) {
        return 'Command not found!';
    }

    gtag('event', 'terminal_command', {
        value: textCommand[0],
    });

    return command.execute(currentCommand, terminal, setTerminal);
};
