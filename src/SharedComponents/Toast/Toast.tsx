import { useContext, useEffect, useState } from 'react';

import './toast.css';
import { ToastMessage, ToastMessageContext } from './ToastMessageContext';

export const Toast = () => {
    const { messageList, setMessageList } = useContext(ToastMessageContext);
    const [currentMessage, setCurrentMessage] = useState<ToastMessage | null>(null);

    useEffect(() => {
        if (currentMessage != null) {
            return;
        }

        if (messageList.length === 0) {
            return;
        }

        setCurrentMessage(messageList[0]);

        const messageListCopy = [...messageList];
        messageListCopy.shift();

        setMessageList(messageListCopy);
    }, [currentMessage, messageList, setMessageList]);

    useEffect(() => {
        const timeoutID = setTimeout(() => {
            if (currentMessage != null) {
                setCurrentMessage(null);
            }
        }, 2000);

        return () => clearTimeout(timeoutID);
    }, [currentMessage, setCurrentMessage]);

    if (!currentMessage) {
        return null;
    }

    return (
        <div className={'toast ' + (currentMessage ? 'toast__visible' : '')}>
            {currentMessage?.message}
        </div>
    );
};
