import { Card } from '../../SharedComponents/Card/Card';
import { Character, Equipment, LogMessage } from '../domain/types';

import { PlayerInventory } from './PlayerInventory';

type Props = {
    combatLog: LogMessage[];
    playerInventory: Equipment[];
    playerWealth: number;
    playerCharacters: Character[];
};

export const VerticalCharacterMenu = ({
    combatLog,
    playerInventory,
    playerWealth,
    playerCharacters,
}: Props) => {
    return (
        <>
            <Card title="Log">
                <div>
                    {combatLog.map((log) => (
                        <p key={log.id}>{log.message}</p>
                    ))}
                </div>
            </Card>
            <PlayerInventory
                equippables={playerInventory}
                wealth={playerWealth}
                playerCharacters={playerCharacters}
            />
        </>
    );
};
