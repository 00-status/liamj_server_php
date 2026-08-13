import { IconType } from '../Icon/domain';

export const verticalNavRoutes = [
    { label: 'Landing', route: '/', isHomeLink: true },
    { label: 'D&D Tools', route: '/dnd_tools/dice_roller' },
    { label: 'RPG Tools', route: '/rpg_tools/dialogue_tree' },
    { label: 'Terminal', route: '/terminal' },
];

export type PageLink = {
    label: string;
    route: string;
    iconType?: IconType;
};
