import { createContext } from 'react';

export type ToastMessage = { message: string };

type MessageContext = {
    messageList: Array<ToastMessage>;
    setMessageList: (
        newMessageList: Array<ToastMessage> | ((state: Array<ToastMessage>) => Array<ToastMessage>),
    ) => void;
};

export const ToastMessageContext = createContext<MessageContext>({
    messageList: [],
    setMessageList: () => {},
});
