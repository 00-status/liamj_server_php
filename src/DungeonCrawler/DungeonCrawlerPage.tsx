import { useEffect, useState } from 'react';

import { Page } from '../SharedComponents/Page/Page';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import {
    Ability,
    TargetScope,
    Character,
    DamageType,
    LogMessage,
    AbilityType,
} from './domain/types';
import { applyAbilityEffects } from './domain/character/applyAbilityEffects';
import { attackAbility } from './domain/constants';

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
        magicAttack: 20,
        defence: 10,
        magicDefence: 10,
    },
    modifiers: [],
    abilities: [
        {
            name: 'YEET!',
            cost: 3,
            type: AbilityType.magic,
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
            type: AbilityType.magic,
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
            type: AbilityType.magic,
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

enum GameState {
    player_turn = 'player_turn',
    enemy_turn = 'enemy_turn',
    game_over = 'game_over',
    game_won = 'game_won',
}

const DungeonCrawlerPage = () => {
    const [gameState, setGameState] = useState<GameState>(GameState.player_turn);
    const [currentPlayer, setCurrentPlayer] = useState<Character>(examplePlayer);
    const [currentMonster, setCurrentMonster] = useState<Character | null>(exampleMonster);

    const [combatLog, setCombatLog] = useState<LogMessage[]>([]);

    useEffect(() => {
        if (currentPlayer.currentHP <= 0) {
            setGameState(GameState.game_over);
        }

        if ((currentMonster?.currentHP ?? 0) <= 0) {
            setGameState(GameState.game_won);
        }
    }, [currentPlayer, currentMonster]);

    useEffect(() => {
        if (!currentMonster || !currentPlayer || gameState !== GameState.enemy_turn) {
            return;
        }

        const {
            caster: newMonster,
            opponent: newPlayer,
            logs,
        } = applyAbilityEffects(currentMonster, currentPlayer, attackAbility);

        setCurrentPlayer(newPlayer);
        setCurrentMonster(newMonster);
        setCombatLog((state) => [...state, ...logs]);

        setGameState(GameState.player_turn);
    }, [gameState, currentMonster, currentPlayer]);

    const onPlayerAbility = (ability: Ability) => {
        if (!currentMonster || !currentPlayer) {
            return;
        }

        const {
            caster: newPlayer,
            opponent: newMonster,
            logs,
        } = applyAbilityEffects(currentPlayer, currentMonster, ability);

        setCurrentPlayer(newPlayer);
        setCurrentMonster(newMonster);
        setCombatLog((state) => [...state, ...logs]);

        setGameState(GameState.enemy_turn);
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {gameState === 'game_over' && <div>Game Over!</div>}
            {gameState === 'game_won' && <div>Game Won!</div>}
            {(gameState === 'player_turn' || gameState === 'enemy_turn') && (
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

export default DungeonCrawlerPage;
