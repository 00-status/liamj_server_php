import { useMemo, useState } from 'react';

import './stone-tower-page.css';

import { StoryBook } from './StoryBook';
import { StoryCatalogue } from './StoryCatalogue';
import { HealthBar } from './components/HealthBar';
import { Armies } from './components/Armies';

export type StoneTowerGameState = {
    currentDay: number;
    maximumDefences: number;
    defences: number;
    maximumArmies: number;
    armies: number;
    supply: number;
    alliesAndBoons: Array<string>;
    isPlayerPrepared: boolean;
    commanderAstel: boolean;
};

// IDEA: A mechanic where the player can pin certain adventures if they want to tackle them at a later day.
// IDEA: The Empire's army has a slightly different composition each run.
// IDEA: The player can pick a Preparation Perk at the Start of each day. A card that adds a bonus to their stats in some way.
export const StoneTowerPage = () => {
    const [gameState, setGameState] = useState<StoneTowerGameState>({
        currentDay: 1,
        maximumDefences: 12,
        defences: 4,
        maximumArmies: 5,
        armies: 1,
        supply: 100,
        alliesAndBoons: [],
        isPlayerPrepared: false,
        commanderAstel: false,
    });
    const [currentStory, setCurrentStory] = useState<string | null>(null);
    const [traversedStories, setTraversedStories] = useState<Array<string>>([]);

    const gameStateList = useMemo(() => Object.keys(gameState), [gameState]);

    return (
        <div className="stone-tower-page">
            <div className="stone-tower-page__header">
                <h1 className="stone-tower-page__title">Stone Tower</h1>
            </div>
            <div className="stone-tower-page__stats">
                <div>
                    <h2>Day {gameState.currentDay}</h2>
                    <div>
                        <h3>Defences</h3>
                        <HealthBar
                            health={gameState.defences}
                            maxHealth={gameState.maximumDefences}
                        />
                    </div>
                    <div>
                        <h3>Armies</h3>
                        <Armies
                            armyCount={gameState.armies}
                            maxArmyCount={gameState.maximumArmies}
                        />
                    </div>
                    <div>
                        <h3>Supply</h3>
                        {gameState.supply}
                    </div>
                </div>
                <div>
                    <h3>Allies and Boons</h3>
                    {gameState.alliesAndBoons.map((ally) => (
                        <div key={ally}>
                            {ally}: {ally}
                        </div>
                    ))}
                </div>
            </div>
            {currentStory && (
                <StoryBook
                    storyFileName={currentStory}
                    variablesNamesToObserve={gameStateList}
                    setGameState={setGameState}
                    exitStory={() => setCurrentStory(null)}
                />
            )}
            {!currentStory ? (
                <StoryCatalogue
                    traversedStories={traversedStories}
                    updateCurrentStory={(newStory) => {
                        setCurrentStory(newStory);
                        setTraversedStories((state) => [...state, newStory]);
                    }}
                />
            ) : null}
        </div>
    );
};
