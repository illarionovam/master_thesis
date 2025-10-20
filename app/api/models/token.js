import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

const ALLOWED_SCOPES = ['*', 'email_verify', 'password_reset'];

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
        },
        scope: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                isIn: {
                    args: [ALLOWED_SCOPES],
                    msg: `Scope must be one of: ${ALLOWED_SCOPES.join(', ')}`,
                },
            },
            set(v) {
                this.setDataValue('scope', v.trim());
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
