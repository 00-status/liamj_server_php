import { Page } from '../SharedComponents/Page/Page';

import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import { Character } from './domain/types';

const DungeonCrawlerPage = () => {
    const exampleMonster: Character = {
        name: 'Skeleton',
        currentHP: 10,
        currentMP: 5,
        stats: {
            healthPoints: 10,
            magicPoints: 5,
            attack: 5,
            magicAttack: 10,
            defence: 2,
            magicDefence: 2,
        },
        modifiers: [],
    };
    const examplePlayer: Character = {
        name: 'Jimothy the Jacked',
        currentHP: 20,
        currentMP: 5,
        stats: {
            healthPoints: 20,
            magicPoints: 5,
            attack: 5,
            magicAttack: 10,
            defence: 2,
            magicDefence: 2,
        },
        modifiers: [],
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            <div>
                <MonsterStats monster={exampleMonster} />
                <PlayerStats player={examplePlayer} />
            </div>
        </Page>
    );
};

export default DungeonCrawlerPage;
