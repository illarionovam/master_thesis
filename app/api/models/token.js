import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const Token = sequelize.define(
    'token',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        owner_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'app_user', key: 'id' },
        },
        token: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [16, 4096],
                    msg: 'Token length must be between 16 and 4096 chars',
                },
            },
        },
    },
    {
        tableName: 'token',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { name: 'idx_token_value_unique', unique: true, fields: ['token'] },
            { name: 'idx_token_owner_id', fields: ['owner_id'] },
        ],
    }
);
