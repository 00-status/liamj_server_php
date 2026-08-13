import { useContext } from 'react';

import { Button, ButtonTheme } from '../../SharedComponents/Button/Button';
import { Card } from '../../SharedComponents/Card/Card';
import {
    ToastMessage,
    ToastMessageContext,
} from '../../SharedComponents/Toast/ToastMessageContext';
import { Icon } from '../../SharedComponents/Icon/Icon';
import { IconType } from '../../SharedComponents/Icon/domain';

import { Weapon, WeaponDamage } from './domain/types';

type Props = {
    weapon: Weapon;
};

export const WeaponCard = (props: Props) => {
    const { weapon } = props;

    const messageContext = useContext(ToastMessageContext);

    const hasRange = !!weapon.effectiveRange && !!weapon.ineffectiveRange;
    const formattedWeaponProperties = formatWeaponProperties(weapon.properties);

    const copyText = () => {
        navigator.clipboard.writeText(formatWeaponForCopy(weapon));

        messageContext.setMessageList((state: Array<ToastMessage>) => [
            ...state,
            { message: 'Copied to clipboard!' },
        ]);
    };

    const copyButton = (
        <Button buttonTheme={ButtonTheme.Subtle} onClick={copyText}>
            <Icon iconType={IconType.COPY} />
        </Button>
    );

    return (
        <Card title={weapon.name || weapon.defaultName} button={copyButton}>
            <div>
                <div>
                    <div>
                        <b>Type: </b>
                        {weapon.defaultName}
                    </div>
                    <div>
                        <b>Rarity: </b>
                        {weapon.rarity}
                    </div>
                    {formattedWeaponProperties && (
                        <div>
                            <b>Properties: </b> {formattedWeaponProperties}
                        </div>
                    )}
                    <div>
                        <b>Damage: </b> {formatDamage(weapon.baseDamage, weapon.extraDamage)}
                    </div>
                    {hasRange && (
                        <div>
                            <b>Range (feet): </b>{' '}
                            {weapon.effectiveRange + '/' + weapon.ineffectiveRange}
                        </div>
                    )}
                </div>
                <hr className="divider" />
                <div>
                    <b>{weapon.weaponEffect.name}: </b>
                    {weapon.weaponEffect.description}
                </div>
            </div>
        </Card>
    );
};

const formatWeaponProperties = (weaponProperties: string[]): string => {
    if (weaponProperties.length <= 0) {
        return '';
    }

    return weaponProperties.join(', ');
};

const formatDamage = (damage: WeaponDamage, extraDamage: WeaponDamage): string => {
    if (damage.damageType === extraDamage.damageType && damage.diceType === extraDamage.diceType) {
        const totalDiceCount = damage.diceCount + extraDamage.diceCount;

        return totalDiceCount + 'd' + damage.diceType + ' ' + damage.damageType;
    }

    const regularDamageString = damage.diceCount + 'd' + damage.diceType + ' ' + damage.damageType;
    const extraDamageString =
        extraDamage.diceCount + 'd' + extraDamage.diceType + ' ' + extraDamage.damageType;

    return regularDamageString + ' + ' + extraDamageString;
};

const formatWeaponForCopy = (weapon: Weapon) => {
    const formattedWeaponProperties = formatWeaponProperties(weapon.properties);
    const formattedDamage = formatDamage(weapon.baseDamage, weapon.extraDamage);

    let weaponCopy = `
Name: ${weapon.name}
Type: ${weapon.defaultName}
Rarity: ${weapon.rarity}
Properties: ${formattedWeaponProperties}
Damage: ${formattedDamage}
`;

    if (!!weapon.effectiveRange || !!weapon.ineffectiveRange) {
        weaponCopy += `Range (feet): ${weapon.effectiveRange}/${weapon.ineffectiveRange}
---
`;
    }

    return (weaponCopy += `${weapon.weaponEffect.name}: ${weapon.weaponEffect.description}`);
};
