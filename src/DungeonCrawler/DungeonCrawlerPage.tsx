import { Page } from '../SharedComponents/Page/Page';

const DungeonCrawlerPage = () => {
    return (
        <Page title="Dungeons of Galericca" routes={[]}>
            <div>
                <div>
                    <h2>Monster Name</h2>
                    <div>Monster Stats</div>
                </div>
                <div>
                    <div>
                        Left Panel
                        <h2>Player Character</h2>
                        <div>Actions</div>
                    </div>
                    <div>
                        Right Panel
                        <div>Character Stats</div>
                        <div>Info Log</div>
                    </div>
                </div>
            </div>
        </Page>
    );
};

export default DungeonCrawlerPage;
