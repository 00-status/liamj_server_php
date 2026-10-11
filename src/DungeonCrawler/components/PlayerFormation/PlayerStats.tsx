import './player-stats.css';
import { useMemo } from 'react';

import { getCharacterStat } from '../../domain/character/getCharacterStat';
import { BaseStatNames, Character, Equipment } from '../../domain/types';
import { CharacterStat } from '../CharacterStat';

type Props = {
    character: Character;
    purchasedEquipment: Equipment[];
};

export const PlayerStats = ({ character, purchasedEquipment }: Props) => {
    const characterEquipment = useMemo(() => {
        return purchasedEquipment.filter((equipment) => equipment.characterID === character.id);
    }, [character, purchasedEquipment]);

    return (
        <div className="player-stats">
            <CharacterStat
                label="HP"
                value={`${character.currentHP} / ${getCharacterStat(character, characterEquipment, BaseStatNames.healthPoints)}`}
            />
            <CharacterStat
                label="MP"
                value={`${character.currentMP} / ${getCharacterStat(character, characterEquipment, BaseStatNames.magicPoints)}`}
            />
            <CharacterStat
                label="ATK"
                value={getCharacterStat(character, characterEquipment, BaseStatNames.attack)}
            />
            <CharacterStat
                label="MATK"
                value={getCharacterStat(character, characterEquipment, BaseStatNames.magicAttack)}
            />
            <CharacterStat
                label="DEF"
                value={getCharacterStat(character, characterEquipment, BaseStatNames.defence)}
            />
            <CharacterStat
                label="MDEF"
                value={getCharacterStat(character, characterEquipment, BaseStatNames.magicDefence)}
            />
        </div>
    );
};
