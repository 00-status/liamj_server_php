import { MonsterCombatant } from '../Combatant';
import { attackAbility } from '../constants';
import { Formation, FormationTeam } from '../formation/types';
import {
    AbilityTarget,
    AbilityType,
    BaseStatNames,
    Character,
    CharacterTier,
    DamageScaleMethod,
    DamageType,
    TargetScope,
} from '../types';

import { pickNewMonsterFormation } from './pickNewMonsterFormation';

const exampleMonsters: Character[] = [
    {
        id: crypto.randomUUID(),
        name: 'Skeleton',
        tier: CharacterTier.ONE,
        currentHP: 50,
        currentMP: 0,
        stats: {
            healthPoints: 50,
            magicPoints: 3,
            attack: 10,
            magicAttack: 10,
            defence: 20,
            magicDefence: 20,
            critChance: 0,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [
            attackAbility,
            {
                name: 'Bone Bonk',
                cost: 3,
                type: AbilityType.magic,
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bone Bonk',
                        target: TargetScope.target,
                        damageType: DamageType.MAGIC,
                        power: 3.0,
                        duration: 0,
                    },
                ],
                statusEffects: [],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: 'Armoured Skeleton',
        tier: CharacterTier.ONE,
        currentHP: 50,
        currentMP: 0,
        stats: {
            healthPoints: 50,
            magicPoints: 5,
            attack: 10,
            magicAttack: 10,
            defence: 50,
            magicDefence: 20,
            critChance: 0,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [
            attackAbility,
            {
                name: 'Bone Bonk',
                cost: 3,
                type: AbilityType.magic,
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bone Bonk',
                        target: TargetScope.target,
                        damageType: DamageType.MAGIC,
                        power: 3.0,
                        duration: 0,
                    },
                ],
                statusEffects: [],
            },
        ],
    },
    {
        id: crypto.randomUUID(),
        name: 'Zombie',
        tier: CharacterTier.ONE,
        currentHP: 120,
        currentMP: 0,
        stats: {
            healthPoints: 120,
            magicPoints: 4,
            attack: 15,
            magicAttack: 5,
            defence: 20,
            magicDefence: 20,
            critChance: 0,
        },
        modifiers: [],
        pointModifiers: [],
        abilities: [
            attackAbility,
            {
                name: 'Bite',
                cost: 4,
                type: AbilityType.magic,
                abilityTarget: AbilityTarget.OPPONENT_FORMATION,
                pointEffects: [
                    {
                        id: crypto.randomUUID(),
                        name: 'Bite',
                        target: TargetScope.target,
                        damageType: DamageType.MAGIC,
                        power: 3.0,
                        duration: 0,
                    },
                    {
                        id: crypto.randomUUID(),
                        name: 'Rot Poison',
                        target: TargetScope.target,
                        damageType: DamageType.MAGIC,
                        power: 0.5,
                        duration: 3,
                    },
                ],
                statusEffects: [
                    {
                        id: '1',
                        name: 'Defence Drain',
                        target: TargetScope.target,
                        stat: BaseStatNames.defence,
                        value: -10,
                        damageScaleType: DamageScaleMethod.FLAT,
                        duration: 2,
                    },
                ],
            },
        ],
    },
];

const exampleMonsterFormations: Formation[] = [
    {
        id: crypto.randomUUID(),
        team: FormationTeam.MONSTER,
        gridDimensions: { x: 3, y: 3 },
        combatants: [
            new MonsterCombatant(crypto.randomUUID(), exampleMonsters[0], { x: 1, y: 2 }, 0),
            new MonsterCombatant(crypto.randomUUID(), exampleMonsters[2], { x: 2, y: 2 }, 0),
        ],
    },
    {
        id: crypto.randomUUID(),
        team: FormationTeam.MONSTER,
        gridDimensions: { x: 3, y: 3 },
        combatants: [
            new MonsterCombatant(crypto.randomUUID(), exampleMonsters[1], { x: 1, y: 1 }, 0),
            new MonsterCombatant(crypto.randomUUID(), exampleMonsters[1], { x: 1, y: 3 }, 0),
        ],
    },
];

describe('pickNewMonsterFormation', () => {
    it('throws error when formations list is empty', () => {
        expect(() => pickNewMonsterFormation([])).toThrow(
            'Cannot pick from empty monster formations!',
        );
    });

    it('returns a picked formation with proper MonsterCombatant instances', () => {
        const formation = pickNewMonsterFormation(exampleMonsterFormations);

        expect(formation).toBeDefined();
        expect(formation.combatants.length).toBeGreaterThan(0);
        expect(formation.combatants[0]).toBeInstanceOf(MonsterCombatant);
    });

    it('creates new unique IDs for the combatants and characters', () => {
        const formation1 = pickNewMonsterFormation([exampleMonsterFormations[0]]);
        const formation2 = pickNewMonsterFormation([exampleMonsterFormations[0]]);

        expect(formation1.id).not.toBe(formation2.id);
        expect(formation1.combatants[0].id).not.toBe(formation2.combatants[0].id);
        expect(formation1.combatants[0].character.id).not.toBe(
            formation2.combatants[0].character.id,
        );
    });
});
