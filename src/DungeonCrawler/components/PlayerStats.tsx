import './player-stats.css';
import { useState } from 'react';

import { Ability, AbilityType, BaseStatNames, Character } from '../domain/types';
import { Card } from '../../SharedComponents/Card/Card';
import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { getCharacterStat } from '../domain/character/getCharacterStat';

import { CharacterStat } from './CharacterStat';

enum MenuState {
    base = 'Base',
    magic = 'Magic',
}

type MenuOption = {
    action: () => void;
    label: string;
    isDisabled?: boolean;
};

type Props = {
    player: Character;
    canPlayerAct: boolean;
    onPlayerAbility: (ability: Ability) => void;
};

export const PlayerStats = ({ player, canPlayerAct, onPlayerAbility }: Props) => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.base);

    const getActions = (): Array<MenuOption> => {
        switch (menuState) {
            case MenuState.base: {
                const defaultAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.default)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        isDisabled: ability.cost > player.currentMP || !canPlayerAct,
                    }));

                return [
                    ...defaultAbilities,
                    { action: () => setMenuState(MenuState.magic), label: 'Magic' },
                ];
            }
            case MenuState.magic: {
                const magicAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.magic)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        isDisabled: ability.cost > player.currentMP || !canPlayerAct,
                    }));

                return [
                    { action: () => setMenuState(MenuState.base), label: 'Back' },
                    ...magicAbilities,
                ];
            }
            default:
                return [];
        }
    };

    return (
        <Card title={player.name} isFullWidth>
            <div className="player-stats">
                <div className="player-stats__left-panel">
                    <h2>Actions</h2>
                    {getActions().map((action) => (
                        <Button
                            key={action.label}
                            onClick={action.action}
                            disabled={action.isDisabled}
                            buttonTheme={ButtonTheme.Subtle}
                        >
                            {action.label}
                        </Button>
                    ))}
                </div>
                <div className="player-stats__right-panel">
                    <div className="player-stats__stat-block">
                        <CharacterStat
                            label="HP"
                            value={`${player.currentHP} / ${getCharacterStat(player, BaseStatNames.healthPoints)}`}
                        />
                        <CharacterStat
                            label="MP"
                            value={`${player.currentMP} / ${getCharacterStat(player, BaseStatNames.magicPoints)}`}
                        />
                        <CharacterStat
                            label="ATK"
                            value={getCharacterStat(player, BaseStatNames.attack)}
                        />
                        <CharacterStat
                            label="MATK"
                            value={getCharacterStat(player, BaseStatNames.magicAttack)}
                        />
                        <CharacterStat
                            label="DEF"
                            value={getCharacterStat(player, BaseStatNames.defence)}
                        />
                        <CharacterStat
                            label="MDEF"
                            value={getCharacterStat(player, BaseStatNames.magicDefence)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
};
