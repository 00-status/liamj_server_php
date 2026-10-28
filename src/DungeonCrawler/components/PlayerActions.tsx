import { useMemo, useState } from 'react';

import './player-actions.css';
import type { Ability, Character} from '../domain/types';
import { AbilityType, DamageType } from '../domain/types';
import { calculatePrimaryAbilityDamageType } from '../domain/character/CalculatePrimaryAbilityDamageType';

import { DungeonButton, DungeonButtonTheme } from './DungeonButton';

enum MenuState {
    base = 'Base',
    magic = 'Magic',
}

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
    const [menuState, setMenuState] = useState<MenuState>(MenuState.base);

    const actions = useMemo((): Array<MenuOption> => {
        const mapAbilityToOption = (ability: Ability): MenuOption => ({
            action: () => onPlayerAbility(ability),
            label: ability.name,
            cost: ability.cost,
            buttonTheme: calculateActionTheme(ability),
            isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
            isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
        });

        switch (menuState) {
            case MenuState.base: {
                const defaultAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.default)
                    .map((ability) => mapAbilityToOption(ability));

                return [
                    ...defaultAbilities,
                    {
                        action: () => setMenuState(MenuState.magic),
                        label: 'Magic',
                        cost: 0,
                        buttonTheme: DungeonButtonTheme.DEFAULT,
                    },
                ];
            }
            case MenuState.magic: {
                const magicAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.magic)
                    .map((ability) => mapAbilityToOption(ability));

                return [
                    {
                        action: () => setMenuState(MenuState.base),
                        label: 'Back',
                        cost: 0,
                        buttonTheme: DungeonButtonTheme.DEFAULT,
                    },
                    ...magicAbilities,
                ];
            }
            default:
                return [];
        }
    }, [player, canPlayerTakeActions, currentAbility, onPlayerAbility, menuState]);

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
    const damageType = calculatePrimaryAbilityDamageType(ability);

    switch (damageType) {
        case DamageType.PHYSICAL:
            return DungeonButtonTheme.PHYSICAL;
        case DamageType.MAGIC:
            return DungeonButtonTheme.MAGIC;
        default:
            return DungeonButtonTheme.DEFAULT;
    }
};
