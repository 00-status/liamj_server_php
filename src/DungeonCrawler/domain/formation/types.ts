import { Combatant } from '../Combatant';

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
