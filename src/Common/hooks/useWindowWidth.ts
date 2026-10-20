import { useEffect, useState } from 'react';

export function useWindowWidth(): number {
    const [width, setWidth] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth : 0,
    );

    useEffect(() => {
        if (typeof window === 'undefined') return;

        let timeoutId: ReturnType<typeof setTimeout> | null = null;
        const handleResize = () => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                setWidth(window.innerWidth);
            }, 100);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return width;
}
