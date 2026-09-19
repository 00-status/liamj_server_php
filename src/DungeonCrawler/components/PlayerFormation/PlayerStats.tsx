import './player-stats.css';
import { getCharacterStat } from '../../domain/character/getCharacterStat';
import { BaseStatNames, Character } from '../../domain/types';
import { CharacterStat } from '../CharacterStat';

type Props = {
    player: Character;
};

export const PlayerStats = ({ player }: Props) => {
    return (
        <div className="player-stats">
            <CharacterStat
                label="HP"
                value={`${player.currentHP} / ${getCharacterStat(player, BaseStatNames.healthPoints)}`}
            />
            <CharacterStat
                label="MP"
                value={`${player.currentMP} / ${getCharacterStat(player, BaseStatNames.magicPoints)}`}
            />
            <CharacterStat label="ATK" value={getCharacterStat(player, BaseStatNames.attack)} />
            <CharacterStat
                label="MATK"
                value={getCharacterStat(player, BaseStatNames.magicAttack)}
            />
            <CharacterStat label="DEF" value={getCharacterStat(player, BaseStatNames.defence)} />
            <CharacterStat
                label="MDEF"
                value={getCharacterStat(player, BaseStatNames.magicDefence)}
            />
        </div>
    );
};
