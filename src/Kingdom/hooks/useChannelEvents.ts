// hooks/usePusherEvents.ts
import { useEffect, useRef } from 'react';
import { Channel } from 'pusher-js';

import { KingdomEventHandlers, KingdomEventMap } from '../domain/types';

export const useChannelEvents = (channel: Channel | null, handlers: KingdomEventHandlers) => {
    // Store handlers in a ref so useEffect doesn't re-trigger if handlers change.
    const handlersRef = useRef(handlers);
    handlersRef.current = handlers;

    useEffect(() => {
        if (!channel) {
            return;
        }

        const boundListeners: Array<{
            eventName: string;
            // Ideally, we would type the data coming in through the WebSocket event and verify that the payload is
            // What we expect. The current faith-based appraoch to mapping event data can cause a mismatch between what
            // the back-end sends and what the front-end expects. For now, I think it's an acceptable level of risk.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            callback: (data: any) => void;
        }> = [];

        // Bind all provided handlers dynamically
        (Object.keys(handlersRef.current) as Array<keyof KingdomEventMap>).forEach((eventName) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stableCallback = (data: any) => {
                const currentHandler = handlersRef.current[eventName];
                if (currentHandler) {
                    currentHandler(data);
                }
            };
            channel.bind(eventName, stableCallback);
            boundListeners.push({ eventName, callback: stableCallback });
        });

        // Cleanup: unbind all listeners on unmount or channel change.
        return () => {
            boundListeners.forEach(({ eventName, callback }) => {
                channel.unbind(eventName, callback);
            });
        };
    }, [channel]);
};
