import { useEffect, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import { Character, DamageType, LogMessage } from './domain/types';
import { damageCharacter } from './domain/character/damageCharacter';

const exampleMonster: Character = {
    name: 'Armoured Skeleton',
    currentHP: 50,
    currentMP: 2,
    stats: {
        healthPoints: 50,
        magicPoints: 5,
        attack: 10,
        magicAttack: 10,
        defence: 50,
        magicDefence: 20,
    },
    modifiers: [],
};
const examplePlayer: Character = {
    name: 'Jimothy the Jacked',
    currentHP: 100,
    currentMP: 5,
    stats: {
        healthPoints: 100,
        magicPoints: 5,
        attack: 20,
        magicAttack: 5,
        defence: 10,
        magicDefence: 10,
    },
    modifiers: [],
};

const DungeonCrawlerPage = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Character>(examplePlayer);
    const [currentMonster, setCurrentMonster] = useState<Character | null>(exampleMonster);

    const [combatLog, setCombatLog] = useState<LogMessage[]>([]);
    const [gameState, setGameState] = useState<string>('combat');

    useEffect(() => {
        if (currentPlayer.currentHP <= 0) {
            setGameState('game_won');
        }

        if ((currentMonster?.currentHP ?? 0) <= 0) {
            setGameState('game_over');
        }
    }, [currentPlayer, currentMonster]);

    const onPlayerAttack = () => {
        if (!currentMonster || !currentPlayer) {
            return;
        }

        const damageResult = damageCharacter(
            currentMonster,
            currentPlayer.stats.attack,
            DamageType.physical,
        );

        setCombatLog((state) => [
            ...state,
            {
                id: crypto.randomUUID(),
                message: `${currentPlayer.name} damaged ${currentMonster.name} for ${damageResult.damageTaken}!`,
            },
        ]);

        const newMonster = { ...currentMonster, currentHP: damageResult.newHealth };
        setCurrentMonster(newMonster);

        if (newMonster.currentHP === 0) {
            return;
        }

        const playerDamageResult = damageCharacter(
            currentPlayer,
            currentMonster.stats.attack,
            DamageType.physical,
        );

        setCombatLog((state) => [
            ...state,
            {
                id: crypto.randomUUID(),
                message: `${currentMonster.name} damaged ${currentPlayer.name} for ${playerDamageResult.damageTaken}!`,
            },
        ]);

        const newPlayer = { ...currentPlayer, currentHP: playerDamageResult.newHealth };
        setCurrentPlayer(newPlayer);
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {gameState === 'game_over' && <div>Game Over!</div>}
            {gameState === 'game_won' && <div>Game Won!</div>}
            {gameState === 'combat' && (
                <div className="dungeon-crawler-page">
                    {currentMonster && <MonsterStats monster={currentMonster} />}
                    <PlayerStats
                        player={currentPlayer}
                        combatLog={combatLog}
                        onPlayerAttack={onPlayerAttack}
                    />
                </div>
            )}
        </Page>
    );
};

export default DungeonCrawlerPage;
