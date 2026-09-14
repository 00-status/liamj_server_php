import { useEffect, useMemo, useState } from 'react';

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
import { exampleEquippables } from './domain/equippables';
import { CharacterEquipment } from './components/CharacterEquipment';
import { selectNewMonster } from './domain/monster/selectNewMonster';
import { exampleMonsters } from './domain/monsters';

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
    equipables: exampleEquippables,
    abilities: [
        attackAbility,
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
                    power: 0.2,
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
    const [roomsClearedCount, setRoomsClearedCount] = useState<number>(0);
    const [currentPlayer, setCurrentPlayer] = useState<Character>(examplePlayer);
    const [currentMonster, setCurrentMonster] = useState<Character | null>(() =>
        selectNewMonster(exampleMonsters),
    );

    const [combatLog, setCombatLog] = useState<LogMessage[]>([]);

    const gameState = useMemo(() => {
        if (currentPlayer.currentHP <= 0) {
            return GameState.game_over;
        }

        return GameState.player_turn;
    }, [currentPlayer.currentHP]);

    const onEnemyTurn = () => {
        if (!currentMonster) {
            return;
        }

        const {
            caster: newMonster,
            opponent: newPlayer,
            logs,
        } = applyAbilityEffects(currentMonster, currentPlayer, attackAbility);

        setCurrentPlayer(() => newPlayer);
        setCurrentMonster(() => newMonster);
        setCombatLog((state) => [...state, ...logs]);
    };

    const onPlayerAbility = (ability: Ability) => {
        if (!currentMonster || !currentPlayer) {
            return;
        }

        const {
            caster: newPlayer,
            opponent: newMonster,
            logs,
        } = applyAbilityEffects(currentPlayer, currentMonster, ability);

        setCurrentPlayer(() => newPlayer);

        if (newMonster.currentHP <= 0) {
            setCurrentMonster(() => selectNewMonster(exampleMonsters));
            setRoomsClearedCount((count) => count + 1);
            setCombatLog([]);
        } else {
            setCurrentMonster(() => newMonster);
            setCombatLog((state) => [...state, ...logs]);
            onEnemyTurn();
        }
    };

    const toggleEquipmentActive = (name: string) => {
        setCurrentPlayer((state) => ({
            ...state,
            equipables: state.equipables.map((item) =>
                item.name === name ? { ...item, active: !item.active } : item,
            ),
        }));
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {gameState === 'game_over' && <div>Game Over!</div>}
            {gameState === 'player_turn' && (
                <div className="dungeon-crawler-page">
                    <div className="dungeon-crawler-page__room_count">{roomsClearedCount}</div>
                    {currentMonster && <MonsterStats monster={currentMonster} />}
                    <PlayerStats
                        player={currentPlayer}
                        combatLog={combatLog}
                        onPlayerAbility={onPlayerAbility}
                    />
                    {!!currentPlayer.equipables.length && (
                        <CharacterEquipment
                            equippables={currentPlayer.equipables}
                            toggleEquipmentActive={toggleEquipmentActive}
                        />
                    )}
                </div>
            )}
        </Page>
    );
};

export default DungeonCrawlerPage;
