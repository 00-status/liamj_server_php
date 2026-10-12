import { use, useEffect } from 'react';

import './toast.css';
import { ToastMessageContext } from './ToastMessageContext';

export const Toast = () => {
    const { messageList, setMessageList } = use(ToastMessageContext);
    const currentMessage = messageList[0] ?? null;

    useEffect(() => {
        if (!currentMessage) {
            return;
        }

        const timeoutId = setTimeout(() => {
            setMessageList((previousMessages) => previousMessages.slice(1));
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [currentMessage, setMessageList]);

    if (!currentMessage) {
        return null;
    }

    return (
        <div className="toast toast__visible">
            {currentMessage.message}
        </div>
    );
};
