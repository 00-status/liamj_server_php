import { Directory } from '../../hooks/directories/useDirectories';
import { IHandler } from '../types';

export const WorkingDirectoryHandler: IHandler = {
    execute(command, terminal): string {
        const { directories, currentDirectory } = terminal;

        if (!currentDirectory) {
            return '';
        }

        return assembleFullPathString(currentDirectory.id, directories);
    },
};

const assembleFullPathString = (
    workingDirectoryId: number,
    directories: Array<Directory>,
): string => {
    const directory = directories.find((directory) => directory.id === workingDirectoryId);

    if (!directory) {
        return '';
    }

    const pathString: string = '/' + directory.name;

    const parentDirectoryId = directory.parentDirectory;

    if (parentDirectoryId) {
        return assembleFullPathString(parentDirectoryId, directories) + pathString;
    }

    return pathString;
};
