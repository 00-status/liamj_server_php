import { StoryCard } from './components/StoryCard';
import { storyNames } from './domain/constants';

import './story-catalogue.css';

type Props = { traversedStories: Array<string>; updateCurrentStory: (storyName: string) => void };

export const StoryCatalogue = ({ traversedStories, updateCurrentStory }: Props) => {
    const storiesToDisplay = storyNames.filter((name) => {
        return !traversedStories.find((traversedStoryName) => traversedStoryName === name);
    });

    return (
        <div className="story-catalogue">
            {storiesToDisplay.map((story) => (
                <StoryCard
                    key={story}
                    label={story}
                    description={story}
                    onStorySelect={() => updateCurrentStory(story)}
                />
            ))}
        </div>
    );
};
