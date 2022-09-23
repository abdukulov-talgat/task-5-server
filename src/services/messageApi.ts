import { Express } from 'express';
import http from 'http';
import { RawData, WebSocket, WebSocketServer } from 'ws';
import { nanoid } from 'nanoid';
import { createRejectApiResponse, createSuccessApiResponse, isMessageApiEvent, isValidMessage } from '../utils/utils';
import { MessageApiEvent } from '../types/messageApi/MessageApiEvent';
import { MessageApiEventType } from '../types/messageApi/MessageApiEventType';
import {
    createMessage,
    getMessageDetails,
    getMessagesByUserId,
    getOrCreateUserByName,
    getUsersLikeName,
} from '../models/repository';
import { MessageApiLoginEvent } from '../types/messageApi/MessageApiLoginEvent';
import { User } from '../models/user';
import { MessageApiNewMessageEvent } from '../types/messageApi/MessageApiNewMessageEvent';
import { MessageApiErrorMessage } from '../types/messageApi/MessageApiErrorMessage';
import { Message } from '../models/message';
import { MessageApiGetAllMessagesEvent } from '../types/messageApi/MessageApiGetAllMessagesEvent';
import { MessageApiGetUsersLikeNameEvent } from '../types/messageApi/MessageApiGetUsersLikeNameEvent';
import { DetailedMessage } from '../types/messageApi/DetailedMessage';

interface ClientEntry {
    id: string;
    userId: number;
    webSocket: WebSocket;
}

const addMessageApi = (app: Express) => {
    const server = http.createServer(app);
    const webSocketServer = new WebSocketServer({ server });
    const clients: ClientEntry[] = [];

    webSocketServer.on('connection', (ws) => {
        ws.on('message', onMessageReceived(ws, clients));

        ws.on('close', () => {
            const index = clients.findIndex((client) => client.webSocket === ws);
            if (index !== -1) {
                clients.splice(index, 1);
            }
        });
    });

    setInterval(() => {
        webSocketServer.clients.forEach(function each(ws: WebSocket) {
            ws.ping();
        });
    }, 30000);

    return server;
};

const onMessageReceived = (ws: WebSocket, clients: ClientEntry[]) => {
    return (data: RawData) => {
        try {
            const obj = JSON.parse(data.toString());
            if (isMessageApiEvent(obj)) {
                dispatchEvent(obj, ws, clients);
            }
        } catch (e) {
            console.log(e);
        }
    };
};

const dispatchEvent = (event: MessageApiEvent, ws: WebSocket, clients: ClientEntry[]) => {
    switch (event.type) {
        case MessageApiEventType.Login:
            void handleLoginEvent(event, ws, clients);
            break;
        case MessageApiEventType.NewMessage:
            void handleNewMessageEvent(event, ws, clients);
            break;
        case MessageApiEventType.GetAllMessages:
            void handleGetAllMessagesEvent(event, ws);
            break;
        case MessageApiEventType.GetUsersLikeName:
            void handleGetUsersLikeNameEvent(event, ws);
            break;
        default:
            console.log(`Unknown event type: ${event}. Should never happen.`);
    }
};

const handleLoginEvent = async (event: MessageApiLoginEvent, ws: WebSocket, clients: ClientEntry[]) => {
    const { name } = event.payload;
    const [user] = await getOrCreateUserByName(name);
    const apiResponse = createSuccessApiResponse<User>(user, MessageApiEventType.Login);
    const json = JSON.stringify(apiResponse);

    clients.push({
        id: nanoid(),
        userId: user.id,
        webSocket: ws,
    });

    ws.send(json);
};

const handleNewMessageEvent = async (event: MessageApiNewMessageEvent, ws: WebSocket, clients: ClientEntry[]) => {
    const message = event.payload;
    const errors = await isValidMessage(message);

    if (errors.length === 0) {
        const [sender] = await getOrCreateUserByName(message.senderName);
        const [receiver] = await getOrCreateUserByName(message.receiverName);
        const newMessage = await createMessage({
            senderId: sender.id,
            receiverId: receiver.id,
            title: message.title,
            body: message.body,
        });

        const detailedMessage = (await getMessageDetails(newMessage.id)) as DetailedMessage;
        const apiResponse = createSuccessApiResponse<DetailedMessage>(detailedMessage, MessageApiEventType.NewMessage);
        const json = JSON.stringify(apiResponse);

        clients.filter((client) => client.userId === receiver.id).forEach((client) => client.webSocket.send(json));
        return;
    }

    const apiResponse = createRejectApiResponse(errors.map((it) => MessageApiErrorMessage[it]));
    const json = JSON.stringify(apiResponse);
    return ws.send(json);
};

const handleGetAllMessagesEvent = async (event: MessageApiGetAllMessagesEvent, ws: WebSocket) => {
    const messages = await getMessagesByUserId(event.payload.userId);
    const apiResponse = createSuccessApiResponse<Message[]>(messages, MessageApiEventType.GetAllMessages);
    const json = JSON.stringify(apiResponse);
    ws.send(json);
};

const handleGetUsersLikeNameEvent = async (event: MessageApiGetUsersLikeNameEvent, ws: WebSocket) => {
    const users = await getUsersLikeName(event.payload.name);
    const apiResponse = createSuccessApiResponse<User[]>(users, MessageApiEventType.GetUsersLikeName);
    const json = JSON.stringify(apiResponse);
    ws.send(json);
};

export { addMessageApi };
