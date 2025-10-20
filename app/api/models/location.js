import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const Location = sequelize.define(
    'location_entity',
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
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 300],
                    msg: 'Title must contain no more than 300 characters',
                },
            },
            set(v) {
                this.setDataValue('title', v.trim());
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 3000],
                    msg: 'Description must contain no more than 3000 characters',
                },
            },
            set(v) {
                this.setDataValue('description', v.trim());
            },
        },
        parent_location_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: 'location_entity', key: 'id' },
        },
    },
    {
        tableName: 'location_entity',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { name: 'idx_location_entity_owner_id', fields: ['owner_id'] },
            { name: 'idx_location_entity_parent_id', fields: ['parent_location_id'] },
        ],
    }
);
