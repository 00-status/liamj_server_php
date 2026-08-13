import { ReactNode } from 'react';

import './icon.css';
import { CloseIcon } from './Icons/CloseIcon';
import { CopyIcon } from './Icons/CopyIcon';
import { Dice4 } from './Icons/Dice4';
import { Dice6 } from './Icons/Dice6';
import { Dice8 } from './Icons/Dice8';
import { Dice10 } from './Icons/Dice10';
import { Dice12 } from './Icons/Dice12';
import { Dice20 } from './Icons/Dice20';
import { DownloadIcon } from './Icons/DownloadIcon';
import { DragIcon } from './Icons/DragIcon';
import { EditFileIcon } from './Icons/EditFileIcon';
import { GearsIcon } from './Icons/GearsIcon';
import { HomeIcon } from './Icons/HomeIcon';
import { PencilIcon } from './Icons/PencilIcon';
import { PlusIcon } from './Icons/PlusIcon';
import { TauntIcon } from './Icons/TauntIcon';
import { TrashIcon } from './Icons/TrashIcon';
import { UploadIcon } from './Icons/UploadFile';
import { VeryDissatisfiedIcon } from './Icons/VeryDissatisfiedIcon';
import { IconSize, IconTheme, IconType } from './domain';
import { MenuIcon } from './Icons/MenuIcon';
import { StoreIcon } from './Icons/StoreIcon';
import { Graph4Icon } from './Icons/Graph4';
import { MenuBookIcon } from './Icons/MenuBookIcon';
import { GroupIcon } from './Icons/GroupIcon';
import { SwordsIcon } from './Icons/SwordsIcon';

type Props = {
    iconType: IconType;
    iconTheme?: IconTheme;
    iconSize?: IconSize;
};

export const Icon = (props: Props) => {
    const { iconType, iconTheme, iconSize } = props;

    const styles = {
        width: iconSize ?? '24px',
        height: iconSize ?? '24px',
    };

    const className = 'icon ' + getTheme(iconTheme);

    return (
        <svg
            className={className}
            style={styles}
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
        >
            {iconComponents[iconType]}
        </svg>
    );
};

const getTheme = (theme?: IconTheme): string => {
    switch (theme) {
        case IconTheme.DARK:
            return 'icon-dark';
        case IconTheme.GREEN:
            return 'icon-green';
        case IconTheme.LIGHT:
        default:
            return 'icon-light';
    }
};

const iconComponents: Record<IconType, ReactNode> = {
    [IconType.CLOSE]: <CloseIcon />,
    [IconType.COPY]: <CopyIcon />,
    [IconType.DICE4]: <Dice4 />,
    [IconType.DICE6]: <Dice6 />,
    [IconType.DICE8]: <Dice8 />,
    [IconType.DICE10]: <Dice10 />,
    [IconType.DICE12]: <Dice12 />,
    [IconType.DICE20]: <Dice20 />,
    [IconType.DOANLOAD]: <DownloadIcon />,
    [IconType.DRAG]: <DragIcon />,
    [IconType.EDIT_FILE]: <EditFileIcon />,
    [IconType.GEARS]: <GearsIcon />,
    [IconType.HOME]: <HomeIcon />,
    [IconType.PENCIL]: <PencilIcon />,
    [IconType.PLUS]: <PlusIcon />,
    [IconType.TAUNT]: <TauntIcon />,
    [IconType.TRASH]: <TrashIcon />,
    [IconType.UPLOAD_FILE]: <UploadIcon />,
    [IconType.VERY_DISSATISFIED]: <VeryDissatisfiedIcon />,
    [IconType.MENU]: <MenuIcon />,
    [IconType.STORE]: <StoreIcon />,
    [IconType.SWORDS]: <SwordsIcon />,
    [IconType.GRAPH4]: <Graph4Icon />,
    [IconType.GROUP]: <GroupIcon />,
    [IconType.MENU_BOOK]: <MenuBookIcon />,
};
