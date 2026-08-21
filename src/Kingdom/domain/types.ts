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
