import './player-stats.css';
import { useState } from 'react';

import { Ability, Character, DamageType, LogMessage } from '../domain/types';
import { Card } from '../../SharedComponents/Card/Card';
import { Button } from '../../SharedComponents/Button/Button';

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
    combatLog: LogMessage[];
    onPlayerAbility: (ability?: Ability) => void;
};

export const PlayerStats = ({ player, combatLog, onPlayerAbility }: Props) => {
    const [menuState, setMenuState] = useState<MenuState>(MenuState.base);

    const getActions = (): Array<MenuOption> => {
        switch (menuState) {
            case MenuState.base:
                return [
                    { action: () => onPlayerAbility(), label: 'Attack!' },
                    { action: () => setMenuState(MenuState.magic), label: 'Magic' },
                ];
            case MenuState.magic: {
                const magicAbilities = player.abilities
                    .filter((ability) => ability.damageType === DamageType.magic)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        isDisabled: ability.cost > player.currentMP,
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
                        >
                            {action.label}
                        </Button>
                    ))}
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
                            {combatLog.map((log) => (
                                <p key={log.id} className="player-stats__log">
                                    {log.message}
                                </p>
                            ))}
                        </Card>
                    </div>
                </div>
            </div>
        </Card>
    );
};
