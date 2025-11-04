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
    }
);
