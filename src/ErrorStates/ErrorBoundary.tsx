import { useRouteError } from 'react-router-dom';
import { useEffect } from 'react';

import './route-error-boundary.css';
import { Button } from '../SharedComponents/Button/Button';
import { Icon } from '../SharedComponents/Icon/Icon';
import { IconType } from '../SharedComponents/Icon/domain';

const RouterErrorBoundary = () => {
    const error = useRouteError();

    useEffect(() => {
        console.error(error);
    }, []);

    return (
        <div className="route-error-boundary">
            <div className="route-error-boundary__title">
                <Icon iconType={IconType.TAUNT} />
                <h1>Something Went Wrong...</h1>
            </div>
            <div className="route-error-boundary__content">
                <p>An unexpected error occured.</p>
                <Button
                    onClick={() => {
                        window.location.href = '/';
                    }}
                >
                    <Icon iconType={IconType.HOME} />
                    To homepage
                </Button>
            </div>
        </div>
    );
};

export default RouterErrorBoundary;
