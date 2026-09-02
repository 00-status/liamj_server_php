import { useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import { Character, DamageType } from './domain/types';
import { damageCharacter } from './domain/character/damageCharacter';

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

const DungeonCrawlerPage = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Character>(examplePlayer);
    const [currentMonster, setCurrentMonster] = useState<Character | null>(exampleMonster);

    const onPlayerAttack = () => {
        if (!currentMonster || !currentPlayer) {
            return;
        }

        const damageResult = damageCharacter(
            currentMonster,
            currentPlayer.stats.attack,
            DamageType.physical,
        );
        // Decrement Monster Health based on Player Attack
        // Add message to Log.
        // If Monster Health is 0
        //      Display a grantulations message.
        //
        // Decrement the Player's Health based on the Monster Attack.
        // Add a message to the log.
        // If the Player's Health is 0
        //      Display a Game Over message.
        setCurrentMonster(null);
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            <div className="dungeon-crawler-page">
                {currentMonster && <MonsterStats monster={currentMonster} />}
                <PlayerStats player={currentPlayer} />
            </div>
        </Page>
    );
};

export default DungeonCrawlerPage;
