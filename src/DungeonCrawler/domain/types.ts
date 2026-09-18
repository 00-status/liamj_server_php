export interface Formation {
    id: string;
    team: 'player' | 'monster';
    combatants: Combatant[];
    gridDimensions: { x: number; y: number };
}

export class Combatant {
    constructor(
        public id: string,
        public character: Character,
        public position: Position,
    ) {}

    public createCombatant(args: Combatant) {
        return new Combatant(args.id, args.character, args.position);
    }

    public clone(): Combatant {
        const characterClone = structuredClone(this.character);
        const positionClone = structuredClone(this.position);

        return Object.assign(Object.create(Object.getPrototypeOf(this)), this, {
            character: characterClone,
            position: positionClone,
        });
    }

    cloneWith<T extends Combatant>(this: T, changes: Partial<T>): T {
        const characterClone = structuredClone(this.character);
        const positionClone = structuredClone(this.position);

        return Object.assign(
            Object.create(Object.getPrototypeOf(this)),
            this,
            { character: characterClone, position: positionClone },
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
    ) {
        super(id, character, position);
        this.turnsUntilAction = turnsUntilAction;
    }

    public override createCombatant(args: Combatant): Combatant {
        return new MonsterCombatant(args.id, args.character, args.position, 0);
    }
}

// A player character can act if:
//      They have not yet taken a turn in this round.
// A monster Combatant can act if:
//      Their turnsUntilAction is 0.

// In DungeonCrawlerPage 🟡
//      If the phase is PLAYER_TURN:
//          Wait for the player to act.
//      If the phase is ENEMY_TURN:
//          Dispatch a ENEMY_USES_ABILITY Action.
//      If the phase is ENEMY_EXECUTES
//          Dispatch a FINISH_EXECUTION Action with a 2 second delay.

// At the end of the PLAYER_USES_ABILITY Action 🟡
//      Decrease each monster's turnsUntilAction by 1.
// In the ENEMY_USES_ABILITY Action ✅
// In the FINISH_EXECUTION Action 🟡
//      Get a list of monsters.
//      If the previous phase was ENEMY_TURN AND any enemy's turnsUntilAction is 0
//          Set the phase to ENEMY_TURN.
//      If the previous phase was ENEMY_TURN BUT no monsters' turnsUntilAction is 0
//          Set the phase to PLAYER_TURN.

export interface Position {
    x: number;
    y: number;
}

export interface Character {
    name: string;
    stats: BaseStats;
    currentHP: number;
    currentMP: number;
    modifiers: DynamicStatModifier[];
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

export interface BaseStatModifier {
    id: string;
    stat: keyof BaseStats;
    value: number;
    type: 'flat' | 'percent'; // e.g., +10 ATK vs +15% ATK
}

export interface DynamicStatModifier extends BaseStatModifier {
    name: string;
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
    modifiers: BaseStatModifier[];
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
    modifiers: DynamicStatModifier[];
}

export enum DamageType {
    physical = 'physical',
    magic = 'magic',
    healing = 'healing',
    magic_restore = 'magic_restore',
}

export enum TargetScope {
    self = 'self',
    target = 'target',
    target_and_adjacent = 'target_and_adjacent',
    adjacent = 'adjacent',
    target_and_surrounding = 'target_and_surrounding',
    surrounding = 'surrounding',
    all_opponents = 'entire_formation',
}

export type LogMessage = { id: string; message: string };
