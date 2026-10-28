import type { Character, Position } from './types';

export class Combatant {
    public critBag: boolean[];

    constructor(
        public id: string,
        public character: Character,
        public position: Position,
        critBag: boolean[] = [],
    ) {
        this.critBag = [...critBag];
    }

    public rollCrit(critChance: number, randomFn: () => number = Math.random): boolean {
        if (critChance <= 0) {
            return false;
        }

        if (critChance >= 100) {
            return true;
        }

        if (this.critBag.length === 0) {
            this.resetCritBag(critChance);
        }

        const marbleIndex = Math.floor(randomFn() * this.critBag.length);
        const [isCrit] = this.critBag.splice(marbleIndex, 1);

        if (isCrit) {
            this.resetCritBag(critChance);
            return true;
        }

        return false;
    }

    private resetCritBag(critChance: number): void {
        if (critChance <= 0) {
            this.critBag = [];
            return;
        }

        const totalMarbles = Math.max(1, Math.round(100 / critChance));
        const bag: boolean[] = [true];
        for (let i = 1; i < totalMarbles; i++) {
            bag.push(false);
        }
        this.critBag = bag;
    }

    public clone(): Combatant {
        const characterClone = structuredClone(this.character);
        const positionClone = structuredClone(this.position);
        const critBagClone = [...this.critBag];

        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, {
            character: characterClone,
            position: positionClone,
            critBag: critBagClone,
        });
    }

    cloneWith<T extends Combatant>(this: T, changes: Partial<T>): T {
        const characterClone = structuredClone(this.character);
        const positionClone = structuredClone(this.position);
        const critBagClone = [...this.critBag];

        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this,
            { character: characterClone, position: positionClone, critBag: critBagClone },
            changes,
        );
    }
}

export class MonsterCombatant extends Combatant {
    constructor(
        id: string,
        character: Character,
        position: Position,
        public turnsUntilAction: number,
        critBag: boolean[] = [],
    ) {
        super(id, character, position, critBag);
        this.turnsUntilAction = turnsUntilAction;
    }
}
