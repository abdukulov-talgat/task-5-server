import { Sequelize } from 'sequelize';

const database = new Sequelize(
    process.env.DB_NAME || 'task5',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
);

export { database };
