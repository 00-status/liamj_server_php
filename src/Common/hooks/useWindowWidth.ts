import { useState, useEffect } from 'react';

export function useWindowWidth() {
    // Initialize with undefined or a fallback (e.g., 0) to support SSR environments like Next.js
    const [width, setWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth;
        }
        return 0;
    });

    useEffect(() => {
        // Return early if window is not defined (SSR)
        if (typeof window === 'undefined') return;

        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener('resize', handleResize);

        // Clean up the listener when the component unmounts
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return width;
}
