import { IHandler } from '../types';

export const ConnectHandler: IHandler = {
    execute(command, terminal, setTerminal): string {
        const { servers } = terminal;

        const splitCommand = command.trim().split(' ');

        if (splitCommand.length != 2) {
            return 'Cannot connect to server!';
        }

        const serverName = splitCommand[1];

        const newServer = servers.find((server) => server.name === serverName);

        if (!newServer) {
            return 'Cannot Connect to server!';
        }

        setTerminal({
            ...terminal,
            currentServer: newServer,
            currentDirectory: null,
        });

        return 'Connecting to ' + serverName + ' server:';
    },
};
