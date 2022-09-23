import { MessageApiEventType } from './MessageApiEventType';

export interface MessageApiGetUsersLikeNameEvent {
    type: MessageApiEventType.GetUsersLikeName;
    payload: {
        name: string;
    };
}
