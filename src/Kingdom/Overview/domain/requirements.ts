import { GameContext } from './types';

export interface Requirement {
    description: string;
    check(context: GameContext): boolean;
}

export class ResourceRequirement implements Requirement {
    constructor(
        public resource: string,
        public amount: number,
        public description = `Requires ${amount} ${resource}`,
    ) {}

    check(context: GameContext): boolean {
        const resourceAmount = context.resources[this.resource] ?? null;

        if (this.resource === null) {
            return false;
        }

        return resourceAmount > this.amount;
    }
}

export class TileRequirement implements Requirement {
    constructor(
        public tileType: string,
        public description = `Requires Tile Type of: ${tileType}`,
    ) {}

    check(context: GameContext): boolean {
        return this.tileType === context?.selectedTile?.type;
    }
}

export class TileTraitRequirement implements Requirement {
    constructor(
        public traitName: string,
        public description = `Requires Tile Type of: ${traitName}`,
    ) {}

    check(context: GameContext): boolean {
        return !!context?.selectedTile?.traits.find((trait) => trait === this.traitName);
    }
}
