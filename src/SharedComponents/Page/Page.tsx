import { ReactElement, ReactNode, useEffect, useState } from 'react';
import { gtag } from 'ga-gtag';

import './page.css';
import { ImageButton } from '../ImageButton/ImageButton';
import { ToastMessage, ToastMessageContext } from '../Toast/ToastMessageContext';
import { Toast } from '../Toast/Toast';
import { Icon } from '../Icon/Icon';
import { IconTheme, IconType } from '../Icon/domain';

import { PageErrorBoundary } from './PageErrorBoundary';
import { VerticalNav } from './VerticalNav';
import { PageLink } from './domain';
import { HorizontalNav } from './HorizontalNav';

type Props = {
    title: string;
    routes: Array<PageLink>;
    children: ReactNode;
    footer?: ReactElement;
};

// TODO:
//      Update page tests.

export const Page = (props: Props): ReactElement => {
    const { title, routes, children, footer } = props;

    const [isNavOpen, setIsNavOpen] = useState<boolean>(false);

    const [messageList, setMessageList] = useState<Array<ToastMessage>>([]);

    useEffect(() => {
        const currentRoute = routes.find((route) => route.route === location.pathname);

        if (currentRoute) {
            gtag('event', 'page_view', {
                page_location: currentRoute.route,
                page_title: currentRoute.label,
            });
        }
    }, [routes, location]);

    return (
        <ToastMessageContext value={{ messageList, setMessageList }}>
            <div className="page">
                <div className="page__nav-container">
                    <div className="page__nav-button" onClick={() => setIsNavOpen(!isNavOpen)}>
                        <Icon iconType={IconType.MENU} iconTheme={IconTheme.DARK} />
                    </div>
                    <h3>Liam Johnson</h3>
                    <div className="page__nav-icons">
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
                <div className="page-title-container">
                    <div className="page-title">{title}</div>
                    <VerticalNav isOpen={isNavOpen} setIsOpen={setIsNavOpen} />
                    {routes.length > 0 ? <HorizontalNav routes={routes} /> : null}
                </div>
                <div className="page-content-container">
                    <PageErrorBoundary>{children}</PageErrorBoundary>
                </div>
                <div className="footer">
                    <hr className="divider" />
                    {footer}
                </div>
                <Toast />
            </div>
        </ToastMessageContext>
    );
};
