import { useMemo } from 'react';

import './character-inventory.css';
import { Card } from '../../SharedComponents/Card/Card';
import { Equipment, Character } from '../domain/types';
import { formatModifier } from '../domain/items/formatModifier';

type Props = { equippables: Equipment[]; wealth: number; playerCharacters: Character[] };

export const PlayerInventory = ({ equippables, wealth, playerCharacters }: Props) => {
    const charactersByID = useMemo(() => {
        return playerCharacters.reduce<{ [key: string]: Character }>((acc, character) => {
            acc[character.id] = character;
            return acc;
        }, {});
    }, [playerCharacters]);

    return (
        <Card title="Inventory">
            <div className="character-inventory">
                <div>
                    <h3>Gold: {wealth}</h3>
                </div>
                {equippables.map((equippable) => {
                    const equippedCharacter = equippable.characterID
                        ? charactersByID[equippable.characterID]
                        : null;
                    return (
                        <div key={equippable.name}>
                            <div className="character-inventory__item-header">
                                <h3>
                                    {equippable.name} | {equippable.slot}
                                </h3>
                            </div>
                            {equippedCharacter && <div>{equippedCharacter.name}</div>}
                            <div>
                                {equippable.modifiers.map((modifier) => (
                                    <div key={modifier.id}>{formatModifier(modifier)}</div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
};
