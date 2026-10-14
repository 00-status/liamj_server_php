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

    public resetCritBag(critChance: number): void {
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

export interface Position {
    x: number;
    y: number;
}

export interface Character {
    id: string;
    name: string;
    tier: CharacterTier;
    stats: BaseStats;
    currentHP: number;
    currentMP: number;
    modifiers: DynamicStatModifier[];
    pointModifiers: PointModifier[];
    abilities: Ability[];
}

export enum CharacterTier {
    ONE = 1,
    TWO = 2,
    THREE = 3,
    FOUR = 4,
}

export enum BaseStatNames {
    healthPoints = 'healthPoints',
    magicPoints = 'magicPoints',
    attack = 'attack',
    magicAttack = 'magicAttack',
    defence = 'defence',
    magicDefence = 'magicDefence',
    critChance = 'critChance',
}

export interface BaseStats {
    [BaseStatNames.healthPoints]: number;
    [BaseStatNames.magicPoints]: number;
    [BaseStatNames.attack]: number;
    [BaseStatNames.magicAttack]: number;
    [BaseStatNames.defence]: number;
    [BaseStatNames.magicDefence]: number;
    [BaseStatNames.critChance]: number;
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
    id: string;
    characterID: string | null;
    name: string;
    cost: number;
    slot: EquipmentSlot;
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
    id: string;
    name: string;
    target: TargetScope;
    duration: number;
}

export interface PointEffect extends AbilityEffect {
    damageType: DamageType;
    power: number;
}

export interface StatusEffect extends AbilityEffect {
    stat: keyof BaseStats;
    value: number;
    damageScaleType: DamageScaleMethod;
}

export enum DamageType {
    PHYSICAL = 'PHYSICAL',
    MAGIC = 'MAGIC',
    HEALING = 'HEALING',
    MAGIC_RESTORE = 'MAGIC_RESTORE',
    MAGIC_DRAIN = 'MAGIC_DRAIN',
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

export enum CombatEventType {
    CAST_ABILITY = 'CAST_ABILITY',
    APPLY_DAMAGE = 'APPLY_DAMAGE',
    APPLY_POINT_EFFECT = 'APPLY_POINT_EFFECT',
    APPLY_STATUS_EFFECT = 'APPLY_STATUS_EFFECT',
    DECREASE_MODIFIERS = 'DECREASE_MODIFIERS',
    DECREASE_TURNS_UNTIL_ACTION = 'DECREASE_TURNS_UNTIL_ACTION',
    RESET_TURN_TIMER = 'RESET_TURN_TIMER',
}

interface BaseCombatEvent {
    id: string;
    type: CombatEventType;
    isProcessed: boolean;
}

interface CastAbilityEvent extends BaseCombatEvent {
    type: CombatEventType.CAST_ABILITY;
    casterCombatantID: string;
    abilityID: string;
}

interface ApplyDamageEvent extends BaseCombatEvent {
    type: CombatEventType.APPLY_DAMAGE;
    sourceName: string;
    damageType: DamageType;
    damageTargets: CombatEventDamageTarget[];
}

export interface CombatEventDamageTarget {
    targetCombatantID: string;
    amount: number;
    isCritical?: boolean;
}

interface ApplyPointEffectEvent extends BaseCombatEvent {
    type: CombatEventType.APPLY_POINT_EFFECT;
    pointModifier: PointModifier;
    targetCombatantIDs: string[];
}

interface ApplyStatusEffectEvent extends BaseCombatEvent {
    type: CombatEventType.APPLY_STATUS_EFFECT;
    statModifier: DynamicStatModifier;
    targetCombatantIDs: string[];
}

interface DecreaseModifiersEvent extends BaseCombatEvent {
    type: CombatEventType.DECREASE_MODIFIERS;
    targetCombatantIDs: string[];
}

interface DecreaseTurnsUntilActionEvent extends BaseCombatEvent {
    type: CombatEventType.DECREASE_TURNS_UNTIL_ACTION;
}

interface ResetTurnTimerEvent extends BaseCombatEvent {
    type: CombatEventType.RESET_TURN_TIMER;
    targetCombatantIDs: string[];
}

export type CombatEvent =
    | CastAbilityEvent
    | ApplyDamageEvent
    | ApplyPointEffectEvent
    | ApplyStatusEffectEvent
    | DecreaseModifiersEvent
    | DecreaseTurnsUntilActionEvent
    | ResetTurnTimerEvent;

export interface CombatAnimation {
    id: string;
    combatEventType: CombatEventType;
    name: string;
    container: 'container' | 'child';
    text: string;
}
