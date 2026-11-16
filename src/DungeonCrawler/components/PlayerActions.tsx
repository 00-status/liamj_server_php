import { useMemo } from 'react';

import './player-actions.css';
import type { Ability, Character } from '../domain/types';
import { AbilityType, BaseStatNames } from '../domain/types';
import { calculatePrimaryAbilityStat } from '../domain/character/calculatePrimaryAbilityStat';

import { DungeonButton, DungeonButtonTheme } from './DungeonButton';

type MenuOption = {
    action: () => void;
    label: string;
    cost: number;
    buttonTheme: DungeonButtonTheme;
    isDisabled?: boolean;
    isSelected?: boolean;
};

type Props = {
    player: Character;
    canPlayerTakeActions: boolean;
    currentAbility: Ability | null;
    onPlayerAbility: (ability: Ability) => void;
};

export const PlayerActions = ({
    player,
    canPlayerTakeActions,
    currentAbility,
    onPlayerAbility,
}: Props) => {
    const actions = useMemo((): Array<MenuOption> => {
        const mapAbilityToOption = (ability: Ability): MenuOption => ({
            action: () => onPlayerAbility(ability),
            label: ability.name,
            cost: ability.cost,
            buttonTheme: calculateActionTheme(ability),
            isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
            isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
        });

        const defaultAbilities = player.abilities
            .filter((ability) => ability.type === AbilityType.default)
            .map((ability) => mapAbilityToOption(ability));

        const magicAbilities = player.abilities
            .filter((ability) => ability.type === AbilityType.magic)
            .map((ability) => mapAbilityToOption(ability));

        return [...defaultAbilities, ...magicAbilities];
    }, [player, canPlayerTakeActions, currentAbility, onPlayerAbility]);

    return (
        <div className="player-actions">
            <div className="player-actions__container">
                {actions.map((action) => {
                    const isButtonSelected = action.isSelected;
                    const isButtonDisabled = !action.isSelected && action.isDisabled;
                    return (
                        <DungeonButton
                            key={action.label}
                            onClick={action.action}
                            isDisabled={!!isButtonDisabled}
                            buttonTheme={
                                isButtonSelected ? DungeonButtonTheme.ACTIVE : action.buttonTheme
                            }
                        >
                            {action.label}{' '}
                            {action.cost ? (
                                <span
                                    className={`player-actions__action-cost ${isButtonDisabled ? 'player-actions__actions-cost--disabled' : ''}`}
                                >
                                    {action.cost}
                                </span>
                            ) : undefined}
                        </DungeonButton>
                    );
                })}
            </div>
        </div>
    );
};

const calculateActionTheme = (ability: Ability) => {
    const primaryStat = calculatePrimaryAbilityStat(ability);

    switch (primaryStat) {
        case BaseStatNames.attack:
            return DungeonButtonTheme.PHYSICAL;
        case BaseStatNames.magicAttack:
            return DungeonButtonTheme.MAGIC;
        case BaseStatNames.mind:
            return DungeonButtonTheme.MIND;
        default:
            return DungeonButtonTheme.DEFAULT;
    }
};
