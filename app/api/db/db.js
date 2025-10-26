import pg from 'pg';
import { Sequelize } from 'sequelize';

const { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
export const sequelize = new Sequelize({
    dialect: 'postgres',
    host: DB_HOST,
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    dialectOptions: {
        dialect: 'postgres',
        dialectModule: pg,
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
});
