import { useMemo, useState } from 'react';

import './player-actions.css';
import { Ability, AbilityType, Character } from '../domain/types';

enum MenuState {
    base = 'Base',
    magic = 'Magic',
}

type MenuOption = {
    action: () => void;
    label: string;
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
        switch (menuState) {
            case MenuState.base: {
                const defaultAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.default)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
                        isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
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
                        isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
                        isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
                    }));

                return [
                    { action: () => setMenuState(MenuState.base), label: 'Back' },
                    ...magicAbilities,
                ];
            }
            default:
                return [];
        }
    }, [player, canPlayerTakeActions, currentAbility, onPlayerAbility, menuState]);

    return (
        <div className="player-actions">
            <h2>Actions</h2>
            <div>
                {actions.map((action) => {
                    const isButtonSelected = action.isSelected;
                    const isButtonDisabled = !action.isSelected && action.isDisabled;
                    return (
                        <button
                            className={`player-actions__button ${isButtonSelected && 'player-actions__buttons--selected'}`}
                            key={action.label}
                            onClick={action.action}
                            disabled={isButtonDisabled}
                        >
                            {action.label}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};
