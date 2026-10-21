import { ApplyDamageEvent, DamageLogMessage, DamageType } from '../types';
import { Combatant } from '../Combatant';

export const generateDamageLogs = (
    event: ApplyDamageEvent,
    combatants: Record<string, Combatant>,
): DamageLogMessage[] => {
    const logs: DamageLogMessage[] = [];

    for (const target of event.damageTargets) {
        if (
            (event.damageType === DamageType.MAGIC_RESTORE ||
                event.damageType === DamageType.MAGIC_DRAIN) &&
            target.amount < 3
        ) {
            continue;
        }

        const targetCombatant = combatants[target.targetCombatantID];
        if (!targetCombatant) {
            continue;
        }

        const targetCharacterName = targetCombatant.character.name;
        const isSelf = event.sourceName === targetCharacterName;
        const targetName =
            isSelf && event.damageType === DamageType.HEALING ? 'themself' : targetCharacterName;

        let template = '';
        switch (event.damageType) {
            case DamageType.PHYSICAL:
            case DamageType.MAGIC:
                template = '%sourceName dealt %damageValue %damageType to %targetName!';
                break;
            case DamageType.HEALING:
                template = '%sourceName healed %targetName for %damageValue %damageType!';
                break;
            case DamageType.MAGIC_RESTORE:
                template = '%sourceName restored %damageValue %damageType to %targetName!';
                break;
            case DamageType.MAGIC_DRAIN:
                template = '%sourceName drained %damageValue %damageType from %targetName!';
                break;
            default:
                break;
        }

        if (template) {
            logs.push({
                id: crypto.randomUUID(),
                template,
                sourceName: event.sourceName,
                targetName,
                damageValue: target.amount,
                damageType: event.damageType,
            });
        }
    }

    return logs;
};
