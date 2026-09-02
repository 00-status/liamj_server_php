import './player-stats.css';
import { Character } from '../domain/types';
import { Card } from '../../SharedComponents/Card/Card';

import { CharacterStat } from './CharacterStat';

type Props = {
    player: Character;
    combatLog: string[];
};

export const PlayerStats = ({ player, combatLog }: Props) => {
    return (
        <Card title={player.name} isFullWidth>
            <div className="player-stats">
                <div className="player-stats__left-panel">
                    <div>Actions</div>
                </div>
                <div className="player-stats__right-panel">
                    <div className="player-stats__stat-block">
                        <CharacterStat
                            label="HP"
                            value={`${player.currentHP} / ${player.stats.healthPoints}`}
                        />
                        <CharacterStat
                            label="MP"
                            value={`${player.currentMP} / ${player.stats.magicPoints}`}
                        />
                        <CharacterStat label="ATK" value={player.stats.attack} />
                        <CharacterStat label="MATK" value={player.stats.magicAttack} />
                        <CharacterStat label="DEF" value={player.stats.defence} />
                        <CharacterStat label="MDEF" value={player.stats.magicDefence} />
                    </div>

                    <div>
                        <Card title="Log" isFullWidth>
                            {combatLog.map((log) => log)}
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
    );
};
