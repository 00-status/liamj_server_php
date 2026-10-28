import type { DamageLogMessage, LogMessage } from '../../domain/types';
import { DamageType } from '../../domain/types';

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
    const processedString = log.template
        .replace('%sourceName', log.sourceName)
        .replace('%damageValue', `${log.damageValue}`)
        .replace(`%targetName`, log.targetName);

    const [before, after] = processedString.split('%damageType');

    return (
        <>
            {before}
            <span
                className="vertical-character-menu__highlight"
                data-damage-highlight={log.damageType}
            >
                {damageValueDisplayNames[log.damageType]}
            </span>
            {after}
        </>
    );
};

const damageValueDisplayNames = {
    [DamageType.PHYSICAL]: 'Physical Damage',
    [DamageType.MAGIC]: 'Magic Damage',
    [DamageType.HEALING]: 'Health Points',
    [DamageType.MAGIC_DRAIN]: 'Magic Points',
    [DamageType.MAGIC_RESTORE]: 'Magic Points',
};
