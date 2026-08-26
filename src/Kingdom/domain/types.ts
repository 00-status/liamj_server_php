export interface Tile {
    id: number;
    region_id: number;
    x: number;
    y: number;
    type: string;
}

export interface Region {
    id: number;
    kingdom_id: number;
    region_template_id: number | null;
    name: string;
    origin_x: number;
    origin_y: number;
    tiles: Tile[];
}

export interface Kingdom {
    id: number;
    name: string;
    grid_width: number;
    grid_height: number;
    regions: Region[];
}

export interface KingdomLobby {
    id: number;
    lobbyCode: string;
    timeToDie: string;
    created: string;
}

export interface KingdomPlayer {
    id: number;
    lobbyId: number;
    name: string;
    isLeader: boolean;
    authorizationToken: string;
}
export interface KingdomPlayerDTO {
    id: string;
    name: string;
    idLeader: string;
}

export interface LocalKingdomPlayer {
    timeToDie: string;
    lobbyCode: string;
    authzToken: string;
    name: string;
    isLeader: boolean;
}

// Channel Events
export interface LobbyPlayersUpdatedPayload {
    players: KingdomPlayerDTO[];
}

export type KingdomEventMap = {
    'lobby-players-updated': LobbyPlayersUpdatedPayload;
};

// Map of events and their handlers.
export type KingdomEventHandlers = {
    [K in keyof KingdomEventMap]?: (data: KingdomEventMap[K]) => void;
};
