import Pusher from 'pusher-js';

let currentLobbyCode: string | null = null;
let currentauthzToken: string | null = null;

export const setAuthLobbyCode = (code: string | null) => {
    currentLobbyCode = code;
};
export const setAuthzToken = (authzToken: string | null) => {
    currentLobbyCode = authzToken;
};

export const pusherClient = new Pusher('PUSHER_KEY', {
    cluster: 'us3',
    channelAuthorization: {
        endpoint: '/api/1/lobby/authz',
        transport: 'ajax',
        paramsProvider: () => {
            return { lobby_code: currentLobbyCode, authz_token: currentauthzToken };
        },
    },
});
