import { MonsterCombatant } from '../../domain/Combatant';
import { Formation, FormationTeam } from '../../domain/formation/types';
import { Character, CharacterTier, Position } from '../../domain/types';

interface RawCharacter {
    id?: string;
    name?: string;
    tier?: CharacterTier;
    currentHP?: number;
    currentMP?: number;
    stats?: {
        healthPoints?: number;
        magicPoints?: number;
        attack?: number;
        magicAttack?: number;
        defence?: number;
        magicDefence?: number;
        critChance?: number;
    };
    modifiers?: Character['modifiers'];
    pointModifiers?: Character['pointModifiers'];
    abilities?: Character['abilities'];
}

interface RawCombatant {
    id?: string;
    character?: RawCharacter;
    position?: Position;
    turnsUntilAction?: number;
    critBag?: boolean[];
}

interface RawFormation {
    id?: string;
    team?: FormationTeam;
    combatants?: RawCombatant[];
    gridDimensions?: { x: number; y: number };
}

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

export const deserializeFormations = (raw: unknown): Formation[] => {
    if (!Array.isArray(raw)) {
        return [];
    }

    return (raw as RawFormation[]).map((item) => {
        const combatants: MonsterCombatant[] = Array.isArray(item.combatants)
            ? item.combatants.map((c) => {
                  const rawChar = c.character;
                  const character: Character = {
                      id: rawChar?.id || crypto.randomUUID(),
                      name: rawChar?.name || 'Monster',
                      tier: rawChar?.tier ?? CharacterTier.ONE,
                      currentHP:
                          rawChar?.currentHP ?? rawChar?.stats?.healthPoints ?? 50,
                      currentMP: rawChar?.currentMP ?? 0,
                      stats: {
                          healthPoints: rawChar?.stats?.healthPoints ?? 50,
                          magicPoints: rawChar?.stats?.magicPoints ?? 0,
                          attack: rawChar?.stats?.attack ?? 10,
                          magicAttack: rawChar?.stats?.magicAttack ?? 10,
                          defence: rawChar?.stats?.defence ?? 10,
                          magicDefence: rawChar?.stats?.magicDefence ?? 10,
                          critChance: rawChar?.stats?.critChance ?? 0,
                      },
                      modifiers: Array.isArray(rawChar?.modifiers) ? rawChar.modifiers : [],
                      pointModifiers: Array.isArray(rawChar?.pointModifiers)
                          ? rawChar.pointModifiers
                          : [],
                      abilities: Array.isArray(rawChar?.abilities) ? rawChar.abilities : [],
                  };

                  return new MonsterCombatant(
                      c.id || crypto.randomUUID(),
                      character,
                      {
                          x: c.position?.x ?? 1,
                          y: c.position?.y ?? 1,
                      },
                      c.turnsUntilAction ?? 0,
                      Array.isArray(c.critBag) ? c.critBag : [],
                  );
              })
            : [];

        return {
            id: item.id || crypto.randomUUID(),
            team: FormationTeam.MONSTER,
            combatants,
            gridDimensions: { x: 3, y: 3 },
        };
    });
};
