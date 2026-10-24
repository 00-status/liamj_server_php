import { MonsterCombatant } from '../Combatant';
import { Formation, FormationTeam } from '../formation/types';

export const pickNewMonsterFormation = (potentialFormations: Formation[]): Formation => {
    if (potentialFormations.length === 0) {
        throw new Error('Cannot pick from empty monster formations!');
    }

    const selectedIndex = Math.floor(Math.random() * potentialFormations.length);
    const selectedFormation = potentialFormations[selectedIndex];

    const combatants = selectedFormation.combatants.map((combatant) => {
        const characterClone = structuredClone(combatant.character);
        characterClone.id = crypto.randomUUID();

        return new MonsterCombatant(
            crypto.randomUUID(),
            characterClone,
            { ...combatant.position },
            combatant instanceof MonsterCombatant ? combatant.turnsUntilAction : 0,
            [...combatant.critBag],
        );
    });

    return {
        id: crypto.randomUUID(),
        team: FormationTeam.MONSTER,
        gridDimensions: { ...selectedFormation.gridDimensions },
        combatants,
    };
};
