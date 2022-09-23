import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { database } from './db';

interface Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
    id: CreationOptional<number>;
    senderId: number;
    receiverId: number;
    title: string;
    body: string;
}

const Message = database.define<Message>(
    'message',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        senderId: { type: DataTypes.INTEGER, allowNull: false },
        receiverId: { type: DataTypes.INTEGER, allowNull: false },
        title: { type: DataTypes.STRING, allowNull: false },
        body: { type: DataTypes.STRING, allowNull: false },
    },
    {
        updatedAt: false,
    }
);

export { Message };
