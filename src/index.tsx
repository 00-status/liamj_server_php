import { lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { gtag, initDataLayer, install } from 'ga-gtag';

import './app.css';
import '@react-sigma/core/lib/style.css';
import { StoneTowerPage } from './StoneTower/StoneTowerPage';

const AboutMe = lazy(() => import(/* webpackChunkName: "about-me" */ './AboutMe/AboutMe'));
const DiceRoller = lazy(
    () => import(/* webpackChunkName: "dice-roller" */ './DNDTools/DiceRoller/DiceRoller'),
);
const DndShop = lazy(() => import(/* webpackChunkName: "dnd-shop" */ './DNDTools/DnDShop/DnDShop'));
const WeaponMaker = lazy(
    () => import(/* webpackChunkName: "weapon-maker" */ './DNDTools/WeaponMaker/WeaponMaker'),
);
const DialogueTreeMaker = lazy(
    () =>
        import(
            /* webpackChunkName: "dialogue-tree-maker" */ './RPGTools/DialogueTreeMaker/DialogueTreeMaker'
        ),
);
const CharacterMaker = lazy(
    () =>
        import(
            /* webpackChunkName: "character-maker" */ './RPGTools/CharacterMaker/CharacterMaker'
        ),
);
const TreePreviewPage = lazy(
    () =>
        import(
            /* webpackChunkName: "tree-preview-page" */ './RPGTools/TreePreview/TreePreviewPage'
        ),
);
const NotFoundPage = lazy(
    () => import(/* webpackChunkName: "not-found-page" */ './ErrorStates/NotFoundPage'),
);
const TerminalPage = lazy(
    () => import(/* webpackChunkName: "terminal-page" */ './Terminal/TerminalPage'),
);
const KingdomOverviewPage = lazy(
    () =>
        import(
            /* webpackChunkName: "kingdom-overview-page" */ './Kingdom/components/Overview/KingdomOverviewPage'
        ),
);
const Kingdom = lazy(() => import(/* webpackChunkName: "kingdom" */ './Kingdom/KingdomPage'));
const RegionTemplatesPage = lazy(
    () =>
        import(
            /* webpackChunkName: "region-templates-page" */ './Kingdom/RegionTemplates/RegionTemplatesPage'
        ),
);
const RegionTemplateEditorPage = lazy(
    () =>
        import(
            /* webpackChunkName: "region-template-editor-page" */ './Kingdom/RegionTemplates/RegionTemplateEditorPage'
        ),
);
const WeaponEffectList = lazy(
    () =>
        import(
            /* webpackChunkName: "weapon-effect-list" */ './HiddenPages/WeaponEffectEditor/WeaponEffectList'
        ),
);
const TerminalEditorPage = lazy(
    () =>
        import(
            /* webpackChunkName: "terminal-editor-page" */ './HiddenPages/TerminalEditor/TerminalEditorPage'
        ),
);
const RouterErrorBoundary = lazy(
    () => import(/* webpackChunkName: "about-me" */ './ErrorStates/ErrorBoundary'),
);

initDataLayer();
gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
});
install('G-G0XWWY99FC', { anonymize_ip: true, send_page_view: false });

const rootDomNode = document.getElementById('app');

if (!rootDomNode) {
    throw new Error('Could not find App!');
}

const router = createBrowserRouter([
    { path: '/', element: <AboutMe />, ErrorBoundary: RouterErrorBoundary },
    {
        path: '/dnd_tools/',
        children: [
            { path: '', element: <DiceRoller /> },
            { path: 'dice_roller', element: <DiceRoller /> },
            { path: 'weapon_maker', element: <WeaponMaker /> },
            { path: 'the_shop', element: <DndShop /> },
        ],
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/rpg_tools/',
        children: [
            { path: '', element: <DialogueTreeMaker /> },
            { path: 'dialogue_tree', element: <DialogueTreeMaker /> },
            { path: 'characters', element: <CharacterMaker /> },
            { path: 'tree_preview', element: <TreePreviewPage /> },
        ],
        ErrorBoundary: RouterErrorBoundary,
    },
    { path: '/terminal', element: <TerminalPage />, ErrorBoundary: RouterErrorBoundary },
    {
        path: '/unlisted/weapon_effects',
        element: <WeaponEffectList />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/terminal_editor',
        element: <TerminalEditorPage />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/kingdom',
        element: <Kingdom />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/kingdom_overview',
        element: <KingdomOverviewPage kingdomId={0} />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/region_templates',
        element: <RegionTemplatesPage />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/region_template_editor',
        element: <RegionTemplateEditorPage />,
        ErrorBoundary: RouterErrorBoundary,
    },
    {
        path: '/unlisted/stone_tower',
        element: <StoneTowerPage />,
        ErrorBoundary: RouterErrorBoundary,
    },
    { path: '*', element: <NotFoundPage />, ErrorBoundary: RouterErrorBoundary },
]);

const root = createRoot(rootDomNode);
root.render(<RouterProvider router={router} />);
