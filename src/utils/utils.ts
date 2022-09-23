import { MessageApiEvent } from '../types/messageApi/MessageApiEvent';
import { MessageApiRejectResponse, MessageApiSuccessResponse } from '../types/messageApi/MessageApiResponse';
import { MessageApiErrorMessage } from '../types/messageApi/MessageApiErrorMessage';
import { MessageApiEventType } from '../types/messageApi/MessageApiEventType';
import { ClientMessage } from '../types/messageApi/ClientMessage';

const isMessageApiEvent = (obj: unknown): obj is MessageApiEvent => {
    const event = obj as MessageApiEvent;
    return event.type !== undefined && event.payload !== undefined;
};

const isNonEmptyString = (text: unknown) => {
    return typeof text === 'string' && text.trim().length > 0;
};

const isValidMessage = async ({ senderName, receiverName, title, body }: ClientMessage) => {
    const errors: (keyof typeof MessageApiErrorMessage)[] = [];

    if (!isNonEmptyString(title)) {
        errors.push('NoTitle');
    }
    if (!isNonEmptyString(body)) {
        errors.push('NoBody');
    }
    if (!isNonEmptyString(senderName)) {
        errors.push('NoSender');
    }
    if (!isNonEmptyString(receiverName)) {
        errors.push('NoReceiver');
    }

    return errors;
};

const createSuccessApiResponse = <DATA>(payload: DATA, type: MessageApiEventType): MessageApiSuccessResponse<DATA> => {
    return {
        result: true,
        type: type,
        data: payload,
    };
};

const createRejectApiResponse = (errors: string[]): MessageApiRejectResponse => {
    return {
        result: false,
        errors,
    };
};

export { isMessageApiEvent, createSuccessApiResponse, createRejectApiResponse, isNonEmptyString, isValidMessage };
