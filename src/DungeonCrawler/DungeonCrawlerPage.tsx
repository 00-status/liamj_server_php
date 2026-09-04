import { useEffect, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import { Ability, TargetScope, Character, DamageType, LogMessage } from './domain/types';
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
    abilities: [],
};
const examplePlayer: Character = {
    name: 'Jimothy the Jacked',
    currentHP: 100,
    currentMP: 6,
    stats: {
        healthPoints: 100,
        magicPoints: 6,
        attack: 20,
        magicAttack: 5,
        defence: 10,
        magicDefence: 10,
    },
    modifiers: [],
    abilities: [
        {
            name: 'YEET!',
            cost: 3,
            statusEffects: [
                {
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.5,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Sweep the Leg!',
            cost: 2,
            statusEffects: [
                {
                    target: TargetScope.opponent,
                    damageType: DamageType.magic,
                    power: 1.2,
                    modifiers: [],
                },
            ],
        },
        {
            name: 'Get me a beer!',
            cost: 2,
            statusEffects: [
                {
                    target: TargetScope.self,
                    damageType: DamageType.healing,
                    power: 1.0,
                    modifiers: [],
                },
            ],
        },
    ],
};

const DungeonCrawlerPage = () => {
    const [currentPlayer, setCurrentPlayer] = useState<Character>(examplePlayer);
    const [currentMonster, setCurrentMonster] = useState<Character | null>(exampleMonster);

    const [combatLog, setCombatLog] = useState<LogMessage[]>([]);
    const [gameState, setGameState] = useState<string>('combat');

    useEffect(() => {
        if (currentPlayer.currentHP <= 0) {
            setGameState('game_over');
        }

        if ((currentMonster?.currentHP ?? 0) <= 0) {
            setGameState('game_won');
        }
    }, [currentPlayer, currentMonster]);

    const onPlayerAbility = (ability?: Ability) => {
        if (!currentMonster || !currentPlayer) {
            return;
        }

        setCurrentPlayer((state) => ({
            ...state,
            currentMP: Math.max(0, state.currentMP - (ability?.cost ?? 0)),
        }));

        const damageResult = damageCharacter(
            currentMonster,
            ability
                ? currentPlayer.stats.attack * ability.abilityPower
                : currentPlayer.stats.attack,
            ability ? ability.damageType : DamageType.physical,
        );

        setCombatLog((state) => [
            ...state,
            {
                id: crypto.randomUUID(),
                message: formatLogMessage(
                    currentPlayer.name,
                    currentMonster.name,
                    damageResult.damageTaken,
                    ability ? ability.name : 'Basic Attack',
                ),
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
                message: formatLogMessage(
                    currentMonster.name,
                    currentPlayer.name,
                    playerDamageResult.damageTaken,
                    'Basic Attack',
                ),
            },
        ]);

        setCurrentPlayer((state) => ({
            ...state,
            currentHP: playerDamageResult.newHealth,
        }));
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
                        onPlayerAbility={onPlayerAbility}
                    />
                </div>
            )}
        </Page>
    );
};

const formatLogMessage = (
    attackerName: string,
    target: string,
    damageTaken: string | number,
    abilityName: string,
): string => {
    return `${attackerName} damaged ${target} for ${damageTaken}! using ${abilityName}`;
};

export default DungeonCrawlerPage;
