import Pusher from 'pusher-js';

let currentLobbyCode: string | null = null;
let currentauthzToken: string | null = null;

export const setAuthLobbyCode = (code: string | null) => {
    currentLobbyCode = code;
};
export const setAuthzToken = (authzToken: string | null) => {
    currentLobbyCode = authzToken;
};
const pusherKey = '93b1637d373618c25d47';
export const pusherClient = new Pusher(pusherKey, {
    cluster: 'us3',
    channelAuthorization: {
        endpoint: '/api/1/lobby/authz',
        transport: 'ajax',
        paramsProvider: () => {
            return { lobby_code: currentLobbyCode, authz_token: currentauthzToken };
        },
    },
});
