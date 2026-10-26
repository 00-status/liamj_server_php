import { useMemo, useState } from 'react';

import './player-actions.css';
import { Ability, AbilityType, Character, DamageType } from '../domain/types';

import { DungeonButton, DungeonButtonTheme } from './DungeonButton';

enum MenuState {
    base = 'Base',
    magic = 'Magic',
}

type MenuOption = {
    action: () => void;
    label: string;
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
        switch (menuState) {
            case MenuState.base: {
                const defaultAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.default)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        buttonTheme: calculateActionTheme(ability),
                        isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
                        isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
                    }));

                return [
                    ...defaultAbilities,
                    {
                        action: () => setMenuState(MenuState.magic),
                        label: 'Magic',
                        buttonTheme: DungeonButtonTheme.DEFAULT,
                    },
                ];
            }
            case MenuState.magic: {
                const magicAbilities = player.abilities
                    .filter((ability) => ability.type === AbilityType.magic)
                    .map((ability) => ({
                        action: () => onPlayerAbility(ability),
                        label: ability.name,
                        buttonTheme: calculateActionTheme(ability),
                        isDisabled: ability.cost > player.currentMP || !canPlayerTakeActions,
                        isSelected: currentAbility?.name === ability.name && canPlayerTakeActions,
                    }));

                return [
                    {
                        action: () => setMenuState(MenuState.base),
                        label: 'Back',
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
                            {action.label}
                        </DungeonButton>
                    );
                })}
            </div>
        </div>
    );
};

const calculateActionTheme = (ability: Ability): DungeonButtonTheme => {
    const pointEffects = ability.pointEffects;

    if (pointEffects.length <= 0) {
        return DungeonButtonTheme.DEFAULT;
    }

    let hasMagicPointEffect = false;
    let hasPhysicalPointEffect = false;
    pointEffects.forEach((pointEffect) => {
        if (pointEffect.damageType === DamageType.PHYSICAL) {
            hasPhysicalPointEffect = true;
        }

        if (pointEffect.damageType === DamageType.MAGIC) {
            hasMagicPointEffect = true;
        }
    });

    if (hasPhysicalPointEffect && hasMagicPointEffect) {
        return DungeonButtonTheme.DEFAULT;
    }

    if (hasPhysicalPointEffect && !hasMagicPointEffect) {
        return DungeonButtonTheme.PHYSICAL;
    }

    if (!hasPhysicalPointEffect && hasMagicPointEffect) {
        return DungeonButtonTheme.MAGIC;
    }

    return DungeonButtonTheme.DEFAULT;
};
