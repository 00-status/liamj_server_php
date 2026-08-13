import { IconTheme, IconType } from '../../SharedComponents/Icon/domain';
import { Icon } from '../../SharedComponents/Icon/Icon';
import './army-token.css';

type Props = { isDisabled?: boolean };

export const ArmyToken = ({ isDisabled }: Props) => {
    const classNames = isDisabled ? 'army-token army-token--disabled' : 'army-token';

    return (
        <div className={classNames}>
            <Icon iconType={IconType.SWORDS} iconTheme={IconTheme.LIGHT} />
        </div>
    );
};
