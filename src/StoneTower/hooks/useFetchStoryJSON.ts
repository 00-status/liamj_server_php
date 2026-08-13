import { useEffect, useState } from 'react';

export const useFetchStoryJSON = (fileName: string) => {
    const [rawStory, setRawStory] = useState<null | string>(null);

    useEffect(() => {
        import(`../../assets/${fileName}.ink.json`).then((rawStory) =>
            setRawStory(rawStory.default),
        );
    }, []);

    return rawStory;
};
