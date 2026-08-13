import { TerminalState } from '../Terminal';

import { ChangeDirectoryHandler } from './Commands/ChangeDirectoryHandler';
import { ClearHandler } from './Commands/ClearHandler';
import { ConnectHandler } from './Commands/ConnectHandler';
import { HelpHandler } from './Commands/HelpHandler';
import { HistoryHandler } from './Commands/HistoryHandler';
import { ListHandler } from './Commands/ListHandler';
import { OpenHandler } from './Commands/OpenHandler';
import { WorkingDirectoryHandler } from './Commands/WorkingDirectoryHandler';

export type Command = {
    id: string;
    text: string;
};

export interface IHandler {
    execute(
        command: string,
        terminal: TerminalState,
        setTerminal: (terminal: TerminalState) => void,
    ): string;
}

export const validCommands = new Map<string, IHandler>([
    ['help', HelpHandler],
    ['history', HistoryHandler],
    ['cd', ChangeDirectoryHandler],
    ['list', ListHandler],
    ['ls', ListHandler],
    ['open', OpenHandler],
    ['connect', ConnectHandler],
    ['clear', ClearHandler],
    ['clera', ClearHandler],
    ['pwd', WorkingDirectoryHandler],
]);
