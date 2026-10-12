import { useEffect, useState } from 'react';

import { Character } from './domain/types';

type UseCharacters = {
    characters: Array<Character>;
    setCharacters: (characters: Array<Character>) => void;
};

export const useCharacters = (): UseCharacters => {
    const [characters, setCharacters] = useState<Array<Character>>(() => {
        const charactersString = localStorage.getItem('characters');

        if (charactersString) {
            try {
                const parsedCharacters: Array<Character> = JSON.parse(charactersString);
                return parsedCharacters;
            } catch {
                return [];
            }
        }

        return [];
    });

    useEffect(() => {
        const charactersJson = JSON.stringify(characters);

        localStorage.setItem('characters', charactersJson);
    }, [characters]);

    return {
        characters,
        setCharacters,
    };
};
