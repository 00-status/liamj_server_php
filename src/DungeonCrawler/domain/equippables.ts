import equippables from '../../assets/equipment.json';

import { Equipment } from './types';

// Normally, using unknown at all is a red flag, but if the JSON file is wrong then the Dungeon Crawler app just doesn't work.
// So, in this case, it's fine to assume the JSON file is formatted correctly.
export const exampleEquippables: Equipment[] = equippables as unknown as Equipment[];
