import { MonsterCombatant } from '../Combatant';
import { exampleMonsterFormations } from '../monsters';

import { pickNewMonsterFormation } from './pickNewMonsterFormation';

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
