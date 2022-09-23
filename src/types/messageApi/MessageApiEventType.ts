// export type MessageEventType = 'login' | 'message';

export enum MessageApiEventType {
    Login = 'messageApi/login',
    NewMessage = 'messageApi/newMessage',
    GetAllMessages = 'messageApi/getAllMessages',
    GetUsersLikeName = 'messageApi/getUsersLikeName',
}
