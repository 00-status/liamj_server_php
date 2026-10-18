import './character-stat-card.css';
import { useMemo } from 'react';

import { getCharacterStat } from '../../domain/character/getCharacterStat';
import { BaseStatNames, Character, Equipment } from '../../domain/types';

type Props = {
    character: Character;
    purchasedEquipment: Equipment[];
};

export const CharacterStatCard = ({ character, purchasedEquipment }: Props) => {
    const characterEquipment = useMemo(() => {
        return purchasedEquipment.filter((equipment) => equipment.characterID === character.id);
    }, [character, purchasedEquipment]);

    return (
        <div className="character-stat-card">
            {character.name}
            <div>
                {`HP ${character.currentHP}/${getCharacterStat(character, characterEquipment, BaseStatNames.healthPoints)}`}
            </div>
            <div>
                {`MP ${character.currentMP} / ${getCharacterStat(character, characterEquipment, BaseStatNames.magicPoints)}`}
            </div>
            <div className="character-stat-card__grid">
                <div className="character-stat-card__grid-item">
                    <div>ATK</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.attack)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div>DEF</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.defence)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div>MATK</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.magicAttack)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div>MDEF</div>
                    <div>
                        {getCharacterStat(
                            character,
                            characterEquipment,
                            BaseStatNames.magicDefence,
                        )}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div>CRIT</div>
                    <div>
                        {`${getCharacterStat(character, characterEquipment, BaseStatNames.critChance)}%`}
                    </div>
                </div>
            </div>
        </div>
    );
};
