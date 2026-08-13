import { IHandler } from '../types';

export const ClearHandler: IHandler = {
    execute(): string {
        return new Array(18).fill('\n').join('');
    },
};
