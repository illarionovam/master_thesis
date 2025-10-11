import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

export const AppUser = sequelize.define(
    'app_user',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [1, 255],
                    msg: 'Name must contain from 1 to 255 characters',
                },
            },
            set(v) {
                this.setDataValue('name', normalizeOptionalText(v));
            },
        },
        username: {
            type: DataTypes.CITEXT,
            allowNull: false,
            unique: 'idx_app_user_username_unique',
            validate: {
                len: {
                    args: [3, 60],
                    msg: 'Username must contain from 3 to 60 characters',
                },
            },
            set(v) {
                this.setDataValue('username', v?.trim());
            },
        },
        email: {
            type: DataTypes.CITEXT,
            allowNull: false,
            unique: 'idx_app_user_email_unique',
            validate: {
                isEmail: {
                    msg: 'Email must be a valid email address',
                },
                len: {
                    args: [1, 255],
                    msg: 'Email must contain no more than 255 characters',
                },
            },
            set(v) {
                this.setDataValue('email', v?.trim());
            },
        },
        new_email: {
            type: DataTypes.CITEXT,
            allowNull: true,
            validate: {
                isEmail: {
                    msg: 'Email must be a valid email address',
                },
                len: {
                    args: [1, 255],
                    msg: 'Email must contain no more than 255 characters',
                },
            },
            set(v) {
                this.setDataValue('new_email', normalizeOptionalText(v));
            },
        },
        hash_password: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        avatar_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(v) {
                this.setDataValue('avatar_url', normalizeOptionalText(v));
            },
        },
        verified: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    },
    {
        tableName: 'app_user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'idx_app_user_username_unique',
                unique: true,
                fields: ['username'],
            },
            {
                name: 'idx_app_user_email_unique',
                unique: true,
                fields: ['email'],
            },
        ],
    }
);
