import { MonsterCombatant } from '../../domain/Combatant';
import type { Formation} from '../../domain/formation/types';
import { FormationTeam } from '../../domain/formation/types';
import type { Character, Position } from '../../domain/types';
import { CharacterTier } from '../../domain/types';

export const createDefaultMonsterCharacter = (name: string = 'New Monster'): Character => ({
    id: crypto.randomUUID(),
    name,
    tier: CharacterTier.ONE,
    currentHP: 50,
    currentMP: 0,
    stats: {
        healthPoints: 50,
        magicPoints: 0,
        attack: 10,
        magicAttack: 10,
        defence: 10,
        magicDefence: 10,
        critChance: 0,
    },
    modifiers: [],
    pointModifiers: [],
    abilities: [],
});

export const createDefaultMonsterCombatant = (
    position: Position = { x: 1, y: 1 },
    characterName: string = 'New Monster',
): MonsterCombatant => {
    return new MonsterCombatant(
        crypto.randomUUID(),
        createDefaultMonsterCharacter(characterName),
        position,
        0,
        [],
    );
};

export const createDefaultFormation = (): Formation => {
    return {
        id: crypto.randomUUID(),
        team: FormationTeam.MONSTER,
        combatants: [createDefaultMonsterCombatant({ x: 1, y: 1 }, 'Monster 1')],
        gridDimensions: { x: 3, y: 3 },
    };
};
