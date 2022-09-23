import { database } from './db';
import { User } from './user';
import { Message } from './message';
import './relations';
import { Op } from 'sequelize';
import { DetailedMessage } from '../types/messageApi/DetailedMessage';

const initDatabase = async (): Promise<void> | never => {
    await database.authenticate();
    await database.sync();
};

const getOrCreateUserByName = async (name: string) => {
    return User.findOrCreate({
        where: { name },
    });
};

const getUserById = async (id: number) => {
    return User.findOne({
        where: { id },
    });
};

const getUsersLikeName = async (name: string) => {
    return User.findAll({
        where: {
            name: {
                [Op.iLike]: `%${name}%`,
            },
        },
    });
};

const getMessagesByUserId = async (userId: number) => {
    return Message.findAll({
        where: { receiverId: userId },
        include: { all: true },
        order: [['createdAt', 'DESC']],
    });
};

const createMessage = async ({
    senderId,
    receiverId,
    title,
    body,
}: Pick<Message, 'senderId' | 'receiverId' | 'title' | 'body'>) => {
    return Message.create(
        {
            senderId,
            receiverId,
            title,
            body,
        },
        {
            include: 'receiver',
        }
    );
};

const getMessageDetails = async (messageId: number): Promise<DetailedMessage | null> => {
    const message = Message.findOne({
        where: { id: messageId },
        include: { all: true },
    });
    return message as Promise<DetailedMessage | null>;
};

export {
    initDatabase,
    getOrCreateUserByName,
    getUserById,
    getUsersLikeName,
    getMessagesByUserId,
    createMessage,
    getMessageDetails,
};
