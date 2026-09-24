export interface Formation {
    id: string;
    team: FormationTeam;
    combatants: Combatant[];
    gridDimensions: { x: number; y: number };
}

export enum FormationTeam {
    PLAYER = 'PLAYER',
    MONSTER = 'MONSTER',
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

export enum DamageScaleMethod {
    FLAT = 'FLAT',
    PERCENT = 'PERCENT',
}

export interface BaseStatModifier {
    id: string;
    stat: keyof BaseStats;
    value: number;
    type: DamageScaleMethod; // e.g., +10 ATK vs +15% ATK
}

export interface DynamicStatModifier extends BaseStatModifier {
    name: string;
    duration: number;
}

export interface PointModifier {
    id: string;
    name: string;
    casterStatValue: number;
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
    abilityTarget: AbilityTarget;
    pointEffects: PointEffect[];
    statusEffects: StatusEffect[];
}

export enum AbilityType {
    default = 'default',
    skill = 'skill',
    magic = 'magic',
}

export enum AbilityTarget {
    OPPONENT_FORMATION = 'OPPONENT_FORMATION',
    ALLY_FORMATION = 'ALLY_FORMATION',
    SELF = 'SELF',
    ALL = 'ALL',
}

export interface AbilityEffect {
    name: string;
    target: TargetScope;
    duration: number;
}

export interface PointEffect extends AbilityEffect {
    damageType: DamageType;
    power: number;
}

export interface StatusEffect extends AbilityEffect {
    id: string;
    stat: keyof BaseStats;
    value: number;
    damageScaleType: DamageScaleMethod;
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

export type CombatEvent =
    | {
          type: 'CAST_ABILITY';
          casterCombatantID: string;
          targetCombatantID: string;
          abilityID: string;
      }
    | {
          type: 'APPLY_DAMAGE';
          casterCombatantID: string;
          pointModifierID: string;
          targets: CombatEventDamageTarget[];
      }
    | {
          type: 'APPLY_STATUS_EFFECT';
          casterCombatantID: string;
          statusEffectID: string;
          targets: { targetCombatantID: string }[];
      };

export interface CombatEventDamageTarget {
    targetCombatantID: string;
    amount: number;
    damageType: DamageType;
}
