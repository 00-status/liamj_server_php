import './character-stat-card.css';
import { useMemo } from 'react';

import { getCharacterStat } from '../../domain/character/getCharacterStat';
import { BaseStatNames, Character, Equipment } from '../../domain/types';

import { CharacterEquipment } from './CharacterEquipment';

type Props = {
    character: Character;
    purchasedEquipment: Equipment[];
    onEquipmentSelect: (
        previousEquippableID: string | null,
        newEquippableID: string | null,
        characterID: string,
    ) => void;
};

export const CharacterStatCard = ({ character, purchasedEquipment, onEquipmentSelect }: Props) => {
    const characterEquipment = useMemo(() => {
        return purchasedEquipment.filter((equipment) => equipment.characterID === character.id);
    }, [character, purchasedEquipment]);

    return (
        <div className="character-stat-card">
            {character.name}
            <div>
                <span className="character-stat-card__hit-points">HP</span>
                <span>{` ${character.currentHP}/${getCharacterStat(character, characterEquipment, BaseStatNames.healthPoints)}`}</span>
            </div>
            <div>
                <span className="character-stat-card__magic-points">MP</span>
                <span>{` ${character.currentMP}/${getCharacterStat(character, characterEquipment, BaseStatNames.magicPoints)}`}</span>
            </div>
            <div className="character-stat-card__grid">
                <div className="character-stat-card__grid-item">
                    <div className="character-stat-card__attack">ATK</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.attack)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div className="character-stat-card__defence">DEF</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.defence)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div className="character-stat-card__magic-attack">MATK</div>
                    <div>
                        {getCharacterStat(character, characterEquipment, BaseStatNames.magicAttack)}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div className="character-stat-card__magic-defence">MDEF</div>
                    <div>
                        {getCharacterStat(
                            character,
                            characterEquipment,
                            BaseStatNames.magicDefence,
                        )}
                    </div>
                </div>
                <div className="character-stat-card__grid-item">
                    <div className="character-stat-card__crit">CRIT</div>
                    <div>
                        {`${getCharacterStat(character, characterEquipment, BaseStatNames.critChance)}%`}
                    </div>
                </div>
            </div>
            <CharacterEquipment
                characterID={character.id}
                purchasedEquipment={purchasedEquipment}
                characterEquipment={characterEquipment}
                onEquipmentSelect={onEquipmentSelect}
            />
        </div>
    );
};
