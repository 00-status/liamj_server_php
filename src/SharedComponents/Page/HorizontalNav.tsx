import { useLocation, useNavigate } from 'react-router-dom';

import './horizontal-nav.css';
import { Icon } from '../Icon/Icon';
import { IconTheme } from '../Icon/domain';

import { PageLink } from './domain';

type Props = {
    routes: Array<PageLink>;
};

export const HorizontalNav = (props: Props) => {
    const { routes } = props;

    const navigate = useNavigate();
    const location = useLocation();

    const goToRoute = (newPath: string) => {
        if (newPath !== location.pathname) {
            setTimeout(() => navigate(newPath), 150);
        }
    };

    return (
        <div className="horizontal-nav">
            {routes.map((route) => {
                const isCurrentPath = location.pathname === route.route;
                const classes =
                    'horizontal-nav__item' +
                    (isCurrentPath ? ' horizontal-nav__item--current' : '');

                return (
                    <a
                        key={'horizontal-nav-' + route.route}
                        className={classes}
                        onClick={() => goToRoute(route.route)}
                    >
                        <div className="horizontal-nav__item--icon">
                            {route.iconType ? (
                                <Icon iconType={route.iconType} iconTheme={IconTheme.DARK} />
                            ) : null}
                        </div>
                        <div className="horizontal-nav__item--text">{route.label}</div>
                    </a>
                );
            })}
        </div>
    );
};
