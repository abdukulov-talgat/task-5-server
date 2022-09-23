import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { database } from './db';

interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    id: CreationOptional<number>;
    name: string;
}

const User = database.define<User>(
    'user',
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.STRING, unique: true, allowNull: false },
    },
    {
        updatedAt: false,
        indexes: [
            {
                unique: true,
                fields: ['name'],
            },
        ],
    }
);

export { User };
