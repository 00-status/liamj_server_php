import { Directory } from '../../hooks/directories/useDirectories';
import { TerminalState } from '../../Terminal';

import { ChangeDirectoryHandler } from './ChangeDirectoryHandler';

const rootDirectory = {
    id: 1,
    serverId: 115,
    name: 'root',
    parentDirectory: null,
    subDirectories: [2, 3, 4] as Array<number>,
} as Directory;
const documentsDirectory = {
    id: 2,
    serverId: 115,
    name: 'documents',
    parentDirectory: 1,
    subDirectories: [] as Array<number>,
} as Directory;
const picturesDirectory = {
    id: 3,
    serverId: 115,
    name: 'pictures',
    parentDirectory: 1,
    subDirectories: [4] as Array<number>,
} as Directory;
const photosDirectory = {
    id: 4,
    serverId: 115,
    name: 'photos',
    parentDirectory: 3,
    subDirectories: [] as Array<number>,
} as Directory;

const terminalState: TerminalState = {
    servers: [],
    currentServer: { id: 115, name: 'test_server_name' },
    directories: [rootDirectory, documentsDirectory, picturesDirectory, photosDirectory],
    currentDirectory: rootDirectory,
    commandHistory: [],
    outputs: [],
};

describe('ChangeDirectoryCommand', () => {
    const setTerminal = jest.fn();

    it('should enter a subdirectory', () => {
        ChangeDirectoryHandler.execute('cd ./documents', terminalState, setTerminal);

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith({
            ...terminalState,
            currentDirectory: documentsDirectory,
        });
    });

    it('should enter a subdirectory using an absolute path', () => {
        ChangeDirectoryHandler.execute(
            'cd /documents',
            { ...terminalState, currentDirectory: picturesDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith({
            ...terminalState,
            currentDirectory: documentsDirectory,
        });
    });

    it('should enter multiple sub-directories', () => {
        ChangeDirectoryHandler.execute('cd ./pictures/photos', terminalState, setTerminal);

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith({
            ...terminalState,
            currentDirectory: photosDirectory,
        });
    });

    it('should enter a parent directory', () => {
        ChangeDirectoryHandler.execute(
            'cd ../',
            { ...terminalState, currentDirectory: documentsDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith(terminalState);
    });

    it('should enter multiple parent directories', () => {
        ChangeDirectoryHandler.execute(
            'cd ../../',
            { ...terminalState, currentDirectory: photosDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith(terminalState);
    });

    it('should move up multiple parent directories and enter a child directory', () => {
        ChangeDirectoryHandler.execute(
            'cd ../../documents',
            { ...terminalState, currentDirectory: photosDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith({
            ...terminalState,
            currentDirectory: documentsDirectory,
        });
    });

    it('should enter a sub-directory, move up two directories, and then enter a sub-directory.', () => {
        ChangeDirectoryHandler.execute(
            'cd ./photos/../../documents',
            { ...terminalState, currentDirectory: picturesDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith({
            ...terminalState,
            currentDirectory: documentsDirectory,
        });
    });

    it('should enter the root directory.', () => {
        ChangeDirectoryHandler.execute(
            'cd /',
            { ...terminalState, currentDirectory: picturesDirectory },
            setTerminal,
        );

        expect(setTerminal).toHaveBeenCalledTimes(1);
        expect(setTerminal).toHaveBeenCalledWith(terminalState);
    });
});
