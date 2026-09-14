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
    const { roomsClearedCount, currentPlayer, currentMonster, combatLog } = state;

    const isPlayerDead = currentPlayer.currentHP <= 0;

    useEffect(() => {
        if (state.phase !== GamePhase.ENEMY_TURN) {
            return;
        }

        dispatch({ type: 'ENEMY_USES_ABILITY' });
    }, [state.phase]);

    const onPlayerAbility = (ability: Ability) => {
        dispatch({ type: 'PLAYER_USES_ABILITY', ability });
    };

    const toggleEquipmentActive = (equippableName: string) => {
        dispatch({ type: 'PLAYER_TOGGLES_EQUIPMENT', equippableName });
    };

    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            {isPlayerDead && <div>Game Over!</div>}
            {!isPlayerDead && (
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
