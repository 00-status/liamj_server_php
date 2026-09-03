export interface Character {
    name: string;
    stats: BaseStats;
    currentHP: number;
    currentMP: number;
    modifiers: StatModifier[];
    abilities: Ability[];
}

export interface BaseStats {
    healthPoints: number;
    magicPoints: number;
    attack: number;
    magicAttack: number;
    defence: number;
    magicDefence: number;
}

export interface StatModifier {
    id: string;
    stat: keyof BaseStats;
    value: number;
    type: 'flat' | 'percent'; // e.g., +10 ATK vs +15% ATK
    durationTurns?: number;
}

export interface Ability {
    name: string;
    damageType: DamageType;
    abilityPower: number;
    cost: number;
}

export enum DamageType {
    physical = 'Physical',
    magic = 'Magic',
}

export type LogMessage = { id: string; message: string };
