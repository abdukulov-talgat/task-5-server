import { MessageApiEventType } from './MessageApiEventType';

export interface MessageApiGetAllMessagesEvent {
    type: MessageApiEventType.GetAllMessages;
    payload: {
        userId: number;
    };
}
