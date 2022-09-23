import { MessageApiEventType } from './MessageApiEventType';

export interface MessageApiRejectResponse {
    result: false;
    errors: string[];
}

export interface MessageApiSuccessResponse<DATA> {
    result: true;
    type: MessageApiEventType;
    data: DATA;
}
