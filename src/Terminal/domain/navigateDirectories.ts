import { Directory } from '../hooks/directories/useDirectories';

// TODO: Surface errors related to unknown directories
export const navigateDirectories = (
    directoryGroups: Array<string>,
    directories: Array<Directory>,
    currentDirectory: Directory,
): Directory | null => {
    var chainBrokenAt: string | null = null;

    var carry: Directory = currentDirectory;
    directoryGroups.forEach((group: string, index: number) => {
        switch (group) {
            case '.':
                // Current directory, no change
                break;
            case '..': {
                const newDirectory = moveUpDirectory(directories, carry);
                if (newDirectory) {
                    carry = newDirectory;
                }
                break;
            }
            case '':
                if (index === 0) {
                    const rootDirectory = directories.find(
                        (directory) => directory.parentDirectory === null,
                    );

                    if (!rootDirectory) {
                        throw new Error('Cannot find rootDirectory!');
                    }

                    carry = rootDirectory;
                }
                break;
            default: {
                const newSubDirectory = moveDownDirectory(directories, carry, group);

                if (!newSubDirectory) {
                    chainBrokenAt = group;
                    break;
                }

                carry = newSubDirectory;
                break;
            }
        }
    });

    return chainBrokenAt ? null : carry;
};

const moveUpDirectory = (
    directories: Array<Directory>,
    currentDirectory: Directory,
): Directory | null => {
    const parentDirectory = directories.find((directory) => {
        return currentDirectory.parentDirectory === directory.id;
    });

    return parentDirectory ?? null;
};

const moveDownDirectory = (
    directories: Array<Directory>,
    currentDirectory: Directory,
    desiredDirectoryName: string,
): Directory | null => {
    const childDirectories = directories.filter((directory) => {
        return currentDirectory.subDirectories.find(
            (subDirectoryId) => subDirectoryId === directory.id,
        );
    });

    const newDirectory = childDirectories.find((childDirectory) => {
        return childDirectory.name === desiredDirectoryName;
    });

    return newDirectory ?? null;
};
