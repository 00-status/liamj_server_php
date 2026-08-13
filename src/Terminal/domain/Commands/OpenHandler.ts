import { Directory } from '../../hooks/directories/useDirectories';
import { File } from '../../hooks/files/useFiles';
import { navigateDirectories } from '../navigateDirectories';
import { IHandler } from '../types';

export const OpenHandler: IHandler = {
    execute(command, terminal): string {
        const { directories, currentDirectory } = terminal;

        if (!currentDirectory) {
            return '';
        }

        const path = command
            .replace(/^open\s+/, '')
            .trim()
            .split('/');
        const fileName = path.pop() ?? '';

        const file = findFile(path, fileName, directories, currentDirectory);

        return file ? file.contents : 'No such file exists!';
    },
};

const findFile = (
    path: Array<string>,
    fileName: string,
    directories: Array<Directory>,
    currentDirectory: Directory,
): File | null => {
    const directory = navigateDirectories(path, directories, currentDirectory);

    if (!directory) {
        return null;
    }

    const fileToOpen = directory.files.find((directory) => directory.name === fileName);
    return fileToOpen ?? null;
};
