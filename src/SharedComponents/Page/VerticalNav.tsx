import { useLocation, useNavigate } from 'react-router-dom';

import './vertical-nav.css';
import { IconTheme, IconType } from '../Icon/domain';
import { Icon } from '../Icon/Icon';
import { ImageButton } from '../ImageButton/ImageButton';

import { verticalNavRoutes } from './domain';

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
};

export const VerticalNav = (props: Props) => {
    const { isOpen, setIsOpen } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const goToRoute = (newPath: string) => {
        setIsOpen(false);

        if (newPath !== location.pathname) {
            setTimeout(() => navigate(newPath), 150);
        }
    };

    return (
        <>
            <div
                className={'vertical-nav__overlay' + (isOpen ? ' vertical-nav__overlay--open' : '')}
                onClick={() => setIsOpen(false)}
            />
            <div className={'vertical-nav' + (isOpen ? ' vertical-nav--open' : '')}>
                <div className="vertical-nav__header">
                    <div className="vertical-nav__header-button" onClick={() => setIsOpen(false)}>
                        <Icon iconType={IconType.MENU} iconTheme={IconTheme.DARK} />
                    </div>
                    <h3>Liam Johnson</h3>
                    <div className="vertical-nav__header-links">
                        <ImageButton
                            locationUrl={'https://github.com/00-status'}
                            imageUrl={'https://liamj.b-cdn.net/assets/images/github_cat_icon.svg'}
                        />
                        <ImageButton
                            locationUrl={'https://linkedin.com/in/liam-johnson-36791915a'}
                            imageUrl={'https://liamj.b-cdn.net/assets/images/linkedin_icon.png'}
                        />
                    </div>
                </div>
                <nav className="vertical-nav__list">
                    {verticalNavRoutes.map((route) => {
                        const isCurrent = isCurrentRoute(route.route, location.pathname);
                        const classNames =
                            'vertical-nav__item' +
                            (isCurrent ? ' vertical-nav__item--current' : '');

                        return (
                            <a
                                key={route.route}
                                className={classNames}
                                onClick={() => goToRoute(route.route)}
                            >
                                {route.label}
                                {route.isHomeLink && (
                                    <Icon iconType={IconType.HOME} iconTheme={IconTheme.DARK} />
                                )}
                            </a>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

const isCurrentRoute = (navLinkRoute: string, locationPath: string): boolean => {
    const basePath = locationPath.match(/^\/[^/]*/)?.[0] || '';
    return basePath === '/' ? navLinkRoute === basePath : navLinkRoute.includes(basePath);
};
