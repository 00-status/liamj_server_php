import './character-stat-card.css';
import { useMemo } from 'react';

import { getCharacterStat } from '../../domain/character/getCharacterStat';
import { BaseStatNames, Character, Equipment, EquipmentSlot } from '../../domain/types';

type Props = {
    character: Character;
    purchasedEquipment: Equipment[];
    onEquipmentSelect: (
        previousEquippableID: string | null,
        newEquippableID: string | null,
        characterID: string,
    ) => void;
};

export const CharacterStatCard = ({
    character,
    purchasedEquipment,
    onEquipmentSelect,
}: Props) => {
    const characterEquipment = useMemo(() => {
        return purchasedEquipment.filter((equipment) => equipment.characterID === character.id);
    }, [character, purchasedEquipment]);

    const equippedWeapon = useMemo(() => {
        return characterEquipment.find((item) => item.slot === EquipmentSlot.weapon);
    }, [characterEquipment]);

    const equippedArmour = useMemo(() => {
        return characterEquipment.find((item) => item.slot === EquipmentSlot.armour);
    }, [characterEquipment]);

    const equippedTrinkets = useMemo(() => {
        return characterEquipment.filter((item) => item.slot === EquipmentSlot.trinket);
    }, [characterEquipment]);

    const equippedTrinket1 = equippedTrinkets[0];
    const equippedTrinket2 = equippedTrinkets[1];

    const weaponOptions = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.weapon &&
                (!item.characterID || item.id === equippedWeapon?.id),
        );
    }, [purchasedEquipment, equippedWeapon]);

    const armourOptions = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.armour &&
                (!item.characterID || item.id === equippedArmour?.id),
        );
    }, [purchasedEquipment, equippedArmour]);

    const trinket1Options = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.trinket &&
                (!item.characterID || item.id === equippedTrinket1?.id),
        );
    }, [purchasedEquipment, equippedTrinket1]);

    const trinket2Options = useMemo(() => {
        return purchasedEquipment.filter(
            (item) =>
                item.slot === EquipmentSlot.trinket &&
                (!item.characterID || item.id === equippedTrinket2?.id),
        );
    }, [purchasedEquipment, equippedTrinket2]);

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
            <div className="character-stat-card__equipment">
                <select
                    className="character-stat-card__equipment-select"
                    value={equippedWeapon?.id || ''}
                    aria-label="Weapon"
                    onChange={(e) =>
                        onEquipmentSelect(
                            equippedWeapon?.id || null,
                            e.target.value || null,
                            character.id,
                        )
                    }
                >
                    <option value="">Weapon</option>
                    {weaponOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <select
                    className="character-stat-card__equipment-select"
                    value={equippedArmour?.id || ''}
                    aria-label="Armour"
                    onChange={(e) =>
                        onEquipmentSelect(
                            equippedArmour?.id || null,
                            e.target.value || null,
                            character.id,
                        )
                    }
                >
                    <option value="">Armour</option>
                    {armourOptions.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <select
                    className="character-stat-card__equipment-select"
                    value={equippedTrinket1?.id || ''}
                    aria-label="Trinket 1"
                    onChange={(e) =>
                        onEquipmentSelect(
                            equippedTrinket1?.id || null,
                            e.target.value || null,
                            character.id,
                        )
                    }
                >
                    <option value="">Trinket</option>
                    {trinket1Options.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <select
                    className="character-stat-card__equipment-select"
                    value={equippedTrinket2?.id || ''}
                    aria-label="Trinket 2"
                    onChange={(e) =>
                        onEquipmentSelect(
                            equippedTrinket2?.id || null,
                            e.target.value || null,
                            character.id,
                        )
                    }
                >
                    <option value="">Trinket</option>
                    {trinket2Options.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
