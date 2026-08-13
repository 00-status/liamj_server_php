import { Story } from 'inkjs';
import { SetStateAction, useEffect, useRef, useState } from 'react';

import './story-book.css';
import { useFetchStoryJSON } from './hooks/useFetchStoryJSON';
import { StoneTowerGameState } from './StoneTowerPage';
import { StoryBookButton } from './components/StoryBookButton';

type Props = {
    storyFileName: string;
    variablesNamesToObserve: Array<string>;
    setGameState: (gameState: SetStateAction<StoneTowerGameState>) => void;
    exitStory: () => void;
};

export const StoryBook = ({
    storyFileName,
    variablesNamesToObserve,
    setGameState,
    exitStory,
}: Props) => {
    const rawStory = useFetchStoryJSON(storyFileName);

    const [inkStory, setInkStory] = useState<null | Story>(null);
    const [log, setLog] = useState<string>('');
    const logReference = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!rawStory) {
            return;
        }

        const newInkStory = new Story(rawStory);
        setLog((state) => state + newInkStory.ContinueMaximally());

        setInkStory(newInkStory);
    }, [rawStory]);

    useEffect(() => {
        if (!inkStory) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const observerFunction = (observerVariableName: string, newValue: any) => {
            queueMicrotask(() => {
                setGameState((state) => ({
                    ...state,
                    [observerVariableName]: newValue,
                }));
            });
        };

        Object.keys(inkStory.variablesState).forEach((storyVariableKey) => {
            const shouldObserveVarable = variablesNamesToObserve.find(
                (name) => name === storyVariableKey,
            );

            if (shouldObserveVarable) {
                return inkStory.ObserveVariable(storyVariableKey, observerFunction);
            }
        });

        return () => {
            variablesNamesToObserve.forEach((name) => {
                inkStory.RemoveVariableObserver(observerFunction, name);
            });
        };
    }, [inkStory, variablesNamesToObserve]);

    useEffect(() => {
        if (logReference.current) {
            logReference.current.scrollTop = logReference.current.scrollHeight;
        }
    }, [logReference, log]);

    if (!inkStory) {
        return;
    }

    const makeChoice = (choiceIndex: number) => {
        inkStory.ChooseChoiceIndex(choiceIndex);
        const text = inkStory.ContinueMaximally();
        setLog((state) => state + text);

        if (inkStory.currentChoices.length <= 0) {
            exitStory();
        }
    };

    return (
        <div className="story-book">
            <div ref={logReference} className="story-book__log">
                <h2>{storyFileName}</h2>
                {log}
            </div>
            <div className="story-book__choices">
                {inkStory.currentChoices.map((choice) => (
                    <StoryBookButton
                        key={choice.pathStringOnChoice}
                        onClick={() => makeChoice(choice.index)}
                    >
                        {choice.text}
                    </StoryBookButton>
                ))}
            </div>
        </div>
    );
};
