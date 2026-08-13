import { Directory } from '../hooks/directories/useDirectories';
import { File } from '../hooks/files/useFiles';

import { navigateDirectories } from './navigateDirectories';

export const findNextFileSystemObject = (
    command: string,
    directories: Array<Directory>,
    currentDirectory: Directory,
): string => {
    const commandStringGroups = command.trim().split(' ');

    if (commandStringGroups.length <= 1) {
        return command;
    }

    const filePathGroups = commandStringGroups[1].split('/');
    const fileName = filePathGroups[filePathGroups.length - 1];

    const workingDirectory = findWorkingDirectory(filePathGroups, directories, currentDirectory);

    if (!workingDirectory) {
        return command;
    }

    const childDirectoryNames = findChildDirectories(fileName, directories, workingDirectory);
    const fileNames = findFiles(fileName, workingDirectory);

    const potentialNames = [...childDirectoryNames, ...fileNames];

    if (potentialNames.length <= 0) {
        return command;
    }

    // const commandStringGroups = command.trim().split(" ");
    const basePath = filePathGroups.length > 1 ? filePathGroups.slice(0, -1).join('/') + '/' : '';
    const newPath = `${commandStringGroups[0]} ${basePath ? `${basePath}` : ''}${potentialNames[0]}`;

    return newPath;
};

const findWorkingDirectory = (
    filePathGroups: Array<string>,
    directories: Array<Directory>,
    currentDirectory: Directory,
): Directory | null => {
    if (filePathGroups.length > 1) {
        return navigateDirectories(filePathGroups, directories, currentDirectory);
    } else {
        return currentDirectory;
    }
};

const findChildDirectories = (
    fileName: string,
    directories: Array<Directory>,
    workingDirectory: Directory,
): Array<string> => {
    const childDirectories = directories.filter((directory) => {
        return workingDirectory.subDirectories.find(
            (childDirectoryId) => childDirectoryId === directory.id,
        );
    });

    return childDirectories
        .filter((directory: Directory) => {
            return directory.name.startsWith(fileName);
        })
        .map((directory) => directory.name);
};

const findFiles = (fileName: string, workingDirectory: Directory): Array<string> => {
    return workingDirectory.files
        .filter((file: File) => {
            return file.name.startsWith(fileName);
        })
        .map((file) => file.name);
};
