export enum Rarity {
    Uncommon = 'uncommon',
    Rare = 'rare',
    VeryRare = 'very_rare',
    Legendary = 'legendary',
}

export enum WeaponProperties {
    Finesse = 'Finesse',
    Loading = 'Loading',
    Light = 'Light',
    Reach = 'Reach',
    Thrown = 'Thrown',
    Twohanded = 'Two Handed',
    Versatile = 'Versatile',
    Silvered = 'Silvered',
    Lance = 'Lance',
}

export type WeaponDamage = {
    diceCount: number;
    diceType: DiceType;
    damageType: DamageType;
};

export type WeaponRange = {
    effectiveRange: number;
    ineffectiveRange: number;
};

export enum DiceType {
    four = 4,
    six = 6,
    eight = 8,
    ten = 10,
    twelve = 12,
    twenty = 20,
}

export const diceTypes = [
    { diceType: DiceType.four, rarity: Rarity.Uncommon },
    { diceType: DiceType.six, rarity: Rarity.Uncommon },
    { diceType: DiceType.eight, rarity: Rarity.Uncommon },
    { diceType: DiceType.ten, rarity: Rarity.Rare },
    { diceType: DiceType.twelve, rarity: Rarity.VeryRare },
];

export const diceCounts = [
    { diceCount: 1, rarity: Rarity.Uncommon },
    { diceCount: 2, rarity: Rarity.Rare },
    { diceCount: 3, rarity: Rarity.VeryRare },
    { diceCount: 4, rarity: Rarity.Legendary },
];

export enum DamageType {
    Acid = 'Acid',
    Bludgeoning = 'Bludgeoning',
    Cold = 'Cold',
    Fire = 'Fire',
    Force = 'Force',
    Lightning = 'Lightning',
    Necrotic = 'Necrotic',
    Piercing = 'Piercing',
    Poison = 'Poison',
    Psychic = 'Psychic',
    Radiant = 'Radiant',
    Slashing = 'Slashing',
    Thunder = 'Thunder',
}

export const damageTypes: { damageType: DamageType; rarity: Rarity }[] = [
    { damageType: DamageType.Acid, rarity: Rarity.Rare },
    { damageType: DamageType.Cold, rarity: Rarity.Rare },
    { damageType: DamageType.Fire, rarity: Rarity.Uncommon },
    { damageType: DamageType.Force, rarity: Rarity.Legendary },
    { damageType: DamageType.Lightning, rarity: Rarity.Rare },
    { damageType: DamageType.Necrotic, rarity: Rarity.Rare },
    { damageType: DamageType.Poison, rarity: Rarity.Uncommon },
    { damageType: DamageType.Psychic, rarity: Rarity.Legendary },
    { damageType: DamageType.Radiant, rarity: Rarity.VeryRare },
    { damageType: DamageType.Thunder, rarity: Rarity.Uncommon },
];

export const baseWeapons: { name: string; damage: WeaponDamage; properties: WeaponProperties[] }[] =
    [
        {
            name: 'Battleaxe',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Versatile],
        },
        {
            name: 'Flail',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Bludgeoning },
            properties: [],
        },
        {
            name: 'Glaive',
            damage: { diceCount: 1, diceType: 10, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Reach, WeaponProperties.Twohanded],
        },
        {
            name: 'Greataxe',
            damage: { diceCount: 1, diceType: 12, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Twohanded],
        },
        {
            name: 'Greatsword',
            damage: { diceCount: 2, diceType: 6, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Twohanded],
        },
        {
            name: 'Halberd',
            damage: { diceCount: 1, diceType: 10, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Reach, WeaponProperties.Twohanded],
        },
        {
            name: 'Lance',
            damage: { diceCount: 1, diceType: 12, damageType: DamageType.Piercing },
            properties: [WeaponProperties.Reach, WeaponProperties.Lance],
        },
        {
            name: 'Longsword',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Versatile],
        },
        {
            name: 'Maul',
            damage: { diceCount: 2, diceType: 6, damageType: DamageType.Bludgeoning },
            properties: [WeaponProperties.Twohanded],
        },
        {
            name: 'Morningstar',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Piercing },
            properties: [],
        },
        {
            name: 'Pike',
            damage: { diceCount: 1, diceType: 10, damageType: DamageType.Piercing },
            properties: [WeaponProperties.Reach, WeaponProperties.Twohanded],
        },
        {
            name: 'Rapier',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Piercing },
            properties: [WeaponProperties.Finesse],
        },
        {
            name: 'Scimitar',
            damage: { diceCount: 1, diceType: 6, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Finesse, WeaponProperties.Light],
        },
        {
            name: 'Shortsword',
            damage: { diceCount: 1, diceType: 6, damageType: DamageType.Piercing },
            properties: [WeaponProperties.Finesse, WeaponProperties.Light],
        },
        {
            name: 'Trident',
            damage: { diceCount: 1, diceType: 6, damageType: DamageType.Piercing },
            properties: [WeaponProperties.Thrown, WeaponProperties.Versatile],
        },
        {
            name: 'War pick',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Piercing },
            properties: [],
        },
        {
            name: 'Warhammer',
            damage: { diceCount: 1, diceType: 8, damageType: DamageType.Bludgeoning },
            properties: [WeaponProperties.Versatile],
        },
        {
            name: 'Whip',
            damage: { diceCount: 1, diceType: 4, damageType: DamageType.Slashing },
            properties: [WeaponProperties.Finesse, WeaponProperties.Reach],
        },
    ];

export const weaponActions = [
    {
        type: 'Action',
        effect: 'This weapon can be thrown up to 60ft. On impact, it explodes in a 20ft radius. Each Creature within range must make a DC 15 Dexterity Saving Throw or take 8d6 Fire Damage. The weapon is destroyed when used in this way',
    },
    {
        type: 'Bonus Action',
        effect: 'The wielder can use a Bonus Action to illuminate this weapon in light. When lit in this way, the weapon shines bright light in a 20ft radius',
    },
    {
        type: 'Bonus Action',
        effect: 'The wielder of this weapon can use a Bonus Action to call the weapon back to their hands. When recalled in this manner, each creature in between the wielder and the weapon must make a DC 15 Dexterity Saving Throw. The wielder can make a Damage Roll against each creature that fails this test.',
    },
    {
        type: 'Action',
        effect: "Once per day, the wielder of this weapon can use an Action to make an attack roll on each creature within 5ft of them. Each successful hit reduces the wielder's bonus to hit by 2.",
    },
    {
        type: 'Action',
        effect: 'Once per day, the wielder of this weapon can use an Action to call down a bolt of lightning from the heavens. Each creature in a 10ft radius within 120ft of the wielder must succeed on a DC 16 Dexterity Saving Throw or take 4d12 Lightning Damage. The wielder must be outside to use this ability.',
    },
    {
        type: 'Action',
        effect: 'Once per day, the wielder of this weapon may use an Action to transmute the earth within a 30ft radius around them into molten lava. A creature takes 10d10 Fire Damage when entering the Lava for the first time or when ending their turn within the lava.',
    },
    {
        type: 'Action',
        effect: 'The wielder of this weapon may create a nature guardian from a tree or shrub. The guardian acts on the wielder’s initiative and uses either the “Awakened Tree” or “Awakened Shrub” stat blocks. The wielder can only create one nature guardian at a time.',
    },
    {
        type: 'Bonus Action',
        effect: 'The wielder of this weapon may use a Bonus Action to teleport to an unoccupied space within 30ft.',
    },
    {
        type: 'Action',
        effect: 'Once per day, the wielder of this weapon can wreath themselves in divine power. For the next minute, the wielder’s weapon attacks deal an additional 2d10 Radiant Damage, and each creature within 10ft of them must succeed on a DC 16 Constitution Saving Throw or become blinded for the next hour. If a creature succeeds on this Saving Throw, then they are immune to the effect for the next 24 hours',
    },
    {
        type: 'Action',
        effect: 'Once per day, the wielder of this weapon can use an Action to make up to five Attack Rolls on one turn. For each attack taken, the wielder takes half of the damage dealt to their target',
    },
    {
        type: 'Bonus Action',
        effect: 'The wielder of this weapon can use a Bonus Action to summon a tangle of ethereal vines on a creature within 60ft of them. That creature must succeed on a DC 14 Strength Saving Throw or become Grappled. The Grapple condition can be ended using an Action or a Help Action',
    },
    {
        type: 'Bonus Action',
        effect: 'The wielder of this weapon can use a Bonus Action to telekinetically move a creature within 60ft. The target must succeed on a DC 16 Strength Saving Throw or be moved 10ft in the direction of the wielder’s choice.',
    },
];
