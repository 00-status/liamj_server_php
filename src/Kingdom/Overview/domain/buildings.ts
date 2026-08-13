import { Requirement, TileRequirement, TileTraitRequirement } from './requirements';

export interface Building {
    id: string;
    name: string;
    requirements: Array<Requirement>;
    assignedTile?: string;
}

export const farm: Building = {
    id: 'farm',
    name: 'Farm',
    requirements: [new TileRequirement('Prairie')],
};

export const lumber_mill: Building = {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    requirements: [new TileRequirement('Forest')],
};

export const iron_mine: Building = {
    id: 'iron_mine',
    name: 'Iron Mine',
    requirements: [new TileRequirement('Mountain'), new TileTraitRequirement('Resource: Iron')],
};

export const quarry: Building = {
    id: 'quarry',
    name: 'Stone Quarry',
    requirements: [new TileRequirement('Mountain'), new TileTraitRequirement('Resource: Stone')],
};

export const stable: Building = {
    id: 'stable',
    name: 'Stable',
    requirements: [new TileRequirement('Prairie'), new TileTraitRequirement('Wild Horses')],
};

export const buildingsList = [farm, lumber_mill, iron_mine, quarry, stable];
