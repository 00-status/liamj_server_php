import { MonsterCombatant } from '../Combatant';
import type { Character, CharacterTier, Position } from '../types';

import type { Formation} from './types';
import { FormationTeam } from './types';

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

export const deserializeFormations = (raw: unknown): Formation[] => {
    if (!Array.isArray(raw)) {
        return [];
    }

    return (raw as RawFormation[]).map((rawFormation) => {
        const combatants = rawFormation.combatants;
        if (rawFormation.id === undefined || !combatants || !Array.isArray(combatants)) {
            throw new Error('Cannot deserialiize Formation!');
        }

        const serializedCombatants: MonsterCombatant[] = combatants.map((combatant) => {
            const rawChar = combatant.character;
            const rawPosition = combatant.position;

            if (
                !rawChar ||
                combatant.id === undefined ||
                combatant.turnsUntilAction === undefined ||
                rawPosition?.x === undefined ||
                rawPosition?.y === undefined
            ) {
                throw new Error('Raw Character does not exist!');
            }

            if (
                rawChar?.id === undefined ||
                rawChar?.name === undefined ||
                rawChar?.tier === undefined ||
                rawChar?.currentHP === undefined ||
                rawChar?.currentMP === undefined ||
                rawChar?.modifiers === undefined ||
                rawChar?.stats === undefined ||
                !Array.isArray(rawChar.modifiers) ||
                rawChar?.pointModifiers === undefined ||
                !Array.isArray(rawChar.pointModifiers) ||
                rawChar?.abilities === undefined ||
                !Array.isArray(rawChar.abilities)
            ) {
                throw new Error('Invalid raw Character!');
            }

            const stats = rawChar.stats;

            if (
                stats?.healthPoints === undefined ||
                stats?.magicPoints === undefined ||
                stats?.attack === undefined ||
                stats?.magicAttack === undefined ||
                stats?.defence === undefined ||
                stats?.magicDefence === undefined ||
                stats?.critChance === undefined
            ) {
                throw new Error('Invalid Character Stats');
            }

            const character: Character = {
                id: rawChar.id,
                name: rawChar.name,
                tier: rawChar.tier,
                currentHP: rawChar.currentHP,
                currentMP: rawChar.currentMP,
                stats: {
                    healthPoints: stats.healthPoints,
                    magicPoints: stats.magicPoints,
                    attack: stats.attack,
                    magicAttack: stats.magicAttack,
                    defence: stats.defence,
                    magicDefence: stats.magicDefence,
                    critChance: stats.critChance,
                },
                modifiers: rawChar.modifiers,
                pointModifiers: rawChar.pointModifiers,
                abilities: rawChar.abilities,
            };

            return new MonsterCombatant(
                combatant.id,
                character,
                {
                    x: rawPosition.x,
                    y: rawPosition.y,
                },
                combatant.turnsUntilAction,
                [],
            );
        });

        return {
            id: rawFormation.id,
            team: FormationTeam.MONSTER,
            combatants: serializedCombatants,
            gridDimensions: { x: 3, y: 3 },
        };
    });
};
