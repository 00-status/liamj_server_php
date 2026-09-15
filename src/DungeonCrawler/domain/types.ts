export interface Character {
    name: string;
    stats: BaseStats;
    currentHP: number;
    currentMP: number;
    modifiers: StatModifier[];
    pointModifiers: PointModifier[];
    equipables: Equipment[];
    abilities: Ability[];
}

export enum BaseStatNames {
    healthPoints = 'healthPoints',
    magicPoints = 'magicPoints',
    attack = 'attack',
    magicAttack = 'magicAttack',
    defence = 'defence',
    magicDefence = 'magicDefence',
}

export interface BaseStats {
    [BaseStatNames.healthPoints]: number;
    [BaseStatNames.magicPoints]: number;
    [BaseStatNames.attack]: number;
    [BaseStatNames.magicAttack]: number;
    [BaseStatNames.defence]: number;
    [BaseStatNames.magicDefence]: number;
}

export interface StatModifier {
    id: string;
    name: string;
    stat: keyof BaseStats;
    value: number;
    type: 'flat' | 'percent'; // e.g., +10 ATK vs +15% ATK
    durationTurns: number;
}

export interface PointModifier {
    id: string;
    name: string;
    damageType: DamageType;
    power: number;
    duration: number;
}

export interface Equipment {
    name: string;
    slot: EquipmentSlot;
    active: boolean;
    modifiers: StatModifier[];
}

export enum EquipmentSlot {
    armour = 'armour',
    weapon = 'weapon',
    trinket = 'trinket',
}

export interface Ability {
    name: string;
    cost: number;
    type: AbilityType;
    statusEffects: StatusEffect[];
}

export enum AbilityType {
    default = 'default',
    skill = 'skill',
    magic = 'magic',
}

export interface StatusEffect {
    name: string;
    target: TargetScope;
    damageType: DamageType;
    power: number;
    duration?: number;
    modifiers: StatModifier[];
}

export enum DamageType {
    physical = 'physical',
    magic = 'magic',
    healing = 'healing',
    magic_restore = 'magic_restore',
}

export enum TargetScope {
    self = 'self',
    opponent = 'single_opponent',
    all_opponents = 'all_opponents',
}

export type LogMessage = { id: string; message: string };
