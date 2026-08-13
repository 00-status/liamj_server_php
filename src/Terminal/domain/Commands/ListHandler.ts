import { navigateDirectories } from '../navigateDirectories';
import { IHandler } from '../types';

export const ListHandler: IHandler = {
    execute(command, terminal): string {
        const { directories, currentDirectory } = terminal;

        if (!currentDirectory) {
            return '';
        }

        const commandChunks: string[] = command.trim().split(' ');
        const directoryToMoveTo: string = commandChunks[1] ?? '.';

        const newDirectory = navigateDirectories(
            directoryToMoveTo.split('/'),
            directories,
            currentDirectory,
        );

        if (!newDirectory) {
            return '';
        }

        const childDirectories = directories.filter((directory) => {
            return newDirectory.subDirectories.find(
                (childDirectoryId) => childDirectoryId === directory.id,
            );
        });

        const subDirectories = childDirectories.map((directory) => '{dir}\t' + directory.name);
        const files = newDirectory.files.map((file) => '{file}\t' + file.name);

        return [...subDirectories, ...files].join('\n');
    },
};
