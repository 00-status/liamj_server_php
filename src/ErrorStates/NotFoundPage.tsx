import './not-found-page.css';
import { Page } from '../SharedComponents/Page/Page';

const NotFoundPage = () => {
    return (
        <Page title="Liam Johnson" routes={[]}>
            <div className="not-found-page">
                <h1>Page Not Found!</h1>
            </div>
        </Page>
    );
};

export default NotFoundPage;
