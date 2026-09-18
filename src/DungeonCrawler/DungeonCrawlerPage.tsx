import { useEffect, useReducer } from 'react';

import { Page } from '../SharedComponents/Page/Page';

import './dungeon-crawler-page.css';
import { MonsterStats } from './components/MonsterStats';
import { PlayerStats } from './components/PlayerStats';
import { CharacterEquipment } from './components/CharacterEquipment';
import { dungeonCrawlerInitialState, dungeonCrawlerReducer, GamePhase } from './domain/reducer';
import { Ability } from './domain/types';

const DungeonCrawlerPage = () => {
    const [state, dispatch] = useReducer(dungeonCrawlerReducer, dungeonCrawlerInitialState);
    const { phase, roomsClearedCount, playerFormation, monsterFormation, combatLog } = state;

    useEffect(() => {
        if (phase === GamePhase.ENEMY_EXECUTES) {
            const timer = setTimeout(() => {
                // TODO: Replace with individual animations per each action taken on the enemy's turn.
                dispatch({ type: 'FINISH_EXECUTION' });
            }, 2000);

            return () => clearTimeout(timer);
        }

        if (phase === GamePhase.ENEMY_TURN) {
            dispatch({ type: 'ENEMY_USES_ABILITY' });
            return;
        }

        return;
    }, [phase]);

    useEffect(() => {}, [state.phase]);

    const onPlayerAbility = (ability: Ability) => {
        dispatch({ type: 'PLAYER_USES_ABILITY', ability });
    };

    const toggleEquipmentActive = (equippableName: string) => {
        dispatch({ type: 'PLAYER_TOGGLES_EQUIPMENT', equippableName });
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {phase === GamePhase.GAME_OVER && <div>Game Over!</div>}
            {phase !== GamePhase.GAME_OVER && (
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
