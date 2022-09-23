import { MessageApiEventType } from './MessageApiEventType';

export interface MessageApiLoginEvent {
    readonly type: MessageApiEventType.Login;
    payload: {
        name: string;
    };
}
