import { MessageApiLoginEvent } from './MessageApiLoginEvent';
import { MessageApiNewMessageEvent } from './MessageApiNewMessageEvent';
import { MessageApiGetAllMessagesEvent } from './MessageApiGetAllMessagesEvent';
import { MessageApiGetUsersLikeNameEvent } from './MessageApiGetUsersLikeNameEvent';

export type MessageApiEvent =
    | MessageApiLoginEvent
    | MessageApiNewMessageEvent
    | MessageApiGetAllMessagesEvent
    | MessageApiGetUsersLikeNameEvent;
