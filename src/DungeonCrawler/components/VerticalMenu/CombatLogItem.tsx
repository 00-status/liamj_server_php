import { DamageLogMessage, DamageType, LogMessage } from '../../domain/types';

type Props = {
    log: LogMessage;
};

export const CombatLogItem = ({ log }: Props) => {
    if (!('template' in log)) {
        return <p className="vertical-character-menu__log-item">{log.message}</p>;
    }

    return <p className="vertical-character-menu__log-item">{renderDamageLog(log)}</p>;
};

const renderDamageLog = (log: DamageLogMessage) => {
    switch (log.damageType) {
        case DamageType.PHYSICAL:
            return (
                <>
                    {log.sourceName} dealt {log.damageValue}{' '}
                    <span className="vertical-character-menu__highlight--physical">
                        Physical Damage
                    </span>{' '}
                    to {log.targetName}!
                </>
            );
        case DamageType.MAGIC:
            return (
                <>
                    {log.sourceName} dealt {log.damageValue}{' '}
                    <span className="vertical-character-menu__highlight--magic">
                        Magical Damage
                    </span>{' '}
                    to {log.targetName}!
                </>
            );
        case DamageType.HEALING:
            return (
                <>
                    {log.sourceName} healed {log.targetName} for {log.damageValue}{' '}
                    <span className="vertical-character-menu__highlight--hp">
                        Health Points
                    </span>
                    !
                </>
            );
        case DamageType.MAGIC_RESTORE:
            return (
                <>
                    {log.sourceName} restored {log.damageValue}{' '}
                    <span className="vertical-character-menu__highlight--mp">
                        Magic Points
                    </span>{' '}
                    to {log.targetName}!
                </>
            );
        case DamageType.MAGIC_DRAIN:
            return (
                <>
                    {log.sourceName} drained {log.damageValue}{' '}
                    <span className="vertical-character-menu__highlight--mp">
                        Magic Points
                    </span>{' '}
                    to {log.targetName}!
                </>
            );
        default:
            return log.template;
    }
};
