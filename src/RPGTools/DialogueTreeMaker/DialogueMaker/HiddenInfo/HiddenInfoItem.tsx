import './hidden-info-item.css';
import { Button, ButtonTheme } from '../../../../SharedComponents/Button/Button';
import { HiddenInfo } from '../../domain/types';
import { Icon } from '../../../../SharedComponents/Icon/Icon';
import { IconType } from '../../../../SharedComponents/Icon/domain';

type Props = {
    hiddenInfo: HiddenInfo;
    onDelete: (id: string) => void;
    onEdit: () => void;
};

export const HiddenInfoItem = (props: Props) => {
    const { hiddenInfo, onEdit, onDelete } = props;
    return (
        <div className="hidden-info-item">
            <div className="hidden-info-item__segment">
                {hiddenInfo.conditionIDs.map((condition) => {
                    return <div key={condition.id}>{condition.name}</div>;
                })}
            </div>
            <div className="hidden-info-item__segment">{hiddenInfo.description}</div>
            <div className="hidden-info-item__segment--actions">
                <Button onClick={onEdit}>
                    <Icon iconType={IconType.PENCIL} />
                </Button>
                <Button onClick={() => onDelete(hiddenInfo.id)} buttonTheme={ButtonTheme.Delete}>
                    <Icon iconType={IconType.TRASH} />
                </Button>
            </div>
        </div>
    );
};
