import { useMemo } from 'react';

import './player-inventory.css';
import { Equipment, Character } from '../../domain/types';
import { formatModifier } from '../../domain/items/formatModifier';

type Props = { equippables: Equipment[]; wealth: number; playerCharacters: Character[] };

export const PlayerInventory = ({ equippables, wealth, playerCharacters }: Props) => {
    const charactersByID = useMemo(() => {
        return playerCharacters.reduce<{ [key: string]: Character }>((characterMap, character) => {
            characterMap[character.id] = character;
            return characterMap;
        }, {});
    }, [playerCharacters]);

    return (
        <div className="player-inventory">
            <div>
                <h3>Gold: {wealth}</h3>
            </div>
            <div className="player-inventory__item-list">
                {equippables.map((equippable) => {
                    const equippedCharacter = equippable.characterID
                        ? charactersByID[equippable.characterID]
                        : null;
                    return (
                        <div key={equippable.id} className="player-inventory__item">
                            <div className="player-inventory__item-header">
                                <h3>{equippable.name}</h3>
                            </div>
                            {equippedCharacter && <div>{equippedCharacter.name}</div>}
                            <div className="player-inventory__item-modifiers">
                                {equippable.modifiers.map((modifier) => (
                                    <div key={modifier.id}>{formatModifier(modifier)}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
