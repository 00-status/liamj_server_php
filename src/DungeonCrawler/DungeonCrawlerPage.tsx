import { Page } from '../SharedComponents/Page/Page';

import { MonsterStats } from './components/MonsterStats';
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

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            <div>
                <MonsterStats monster={exampleMonster} />
                <div>
                    <div>
                        Left Panel
                        <h2>Player Character</h2>
                        <div>Actions</div>
                    </div>
                    <div>
                        Right Panel
                        <div>Character Stats</div>
                        <div>Info Log</div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default DungeonCrawlerPage;
