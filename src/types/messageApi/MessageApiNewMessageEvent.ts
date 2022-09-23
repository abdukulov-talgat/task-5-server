import { MessageApiEventType } from './MessageApiEventType';
import { ClientMessage } from './ClientMessage';

export interface MessageApiNewMessageEvent {
    readonly type: MessageApiEventType.NewMessage;
    payload: ClientMessage;
}
