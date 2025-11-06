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
            set(v) {
                this.setDataValue('name', normalizeOptionalText(v));
            },
        },
        username: {
            type: DataTypes.CITEXT,
            allowNull: false,
            unique: 'idx_app_user_username_unique',
            set(v) {
                this.setDataValue('username', v.trim());
            },
        },
        email: {
            type: DataTypes.CITEXT,
            allowNull: false,
            unique: 'idx_app_user_email_unique',
            set(v) {
                this.setDataValue('email', v.trim());
            },
        },
        new_email: {
            type: DataTypes.CITEXT,
            allowNull: true,
            set(v) {
                this.setDataValue('new_email', normalizeOptionalText(v));
            },
        },
        hash_password: {
            type: DataTypes.TEXT,
            allowNull: false,
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
    }
);
