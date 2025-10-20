import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const LocationInWork = sequelize.define(
    'location_in_work',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        location_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'location_entity', key: 'id' },
        },
        work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'work', key: 'id' },
        },
        attributes: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    },
    {
        tableName: 'location_in_work',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { name: 'idx_location_in_work_location_id', fields: ['location_id'] },
            { name: 'idx_location_in_work_work_id', fields: ['work_id'] },
            { name: 'uq_location_in_work', unique: true, fields: ['location_id', 'work_id'] },
        ],
    }
);
