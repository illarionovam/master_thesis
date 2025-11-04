import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const Event = sequelize.define(
    'event',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('title', v.trim());
            },
        },
        order_in_work: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'work', key: 'id' },
        },
        location_in_work_id: {
            type: DataTypes.UUID,
            allowNull: true,
            references: { model: 'location_in_work', key: 'id' },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('description', v.trim());
            },
        },
    },
    {
        tableName: 'event',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { name: 'idx_event_work_id', fields: ['work_id'] },
            { name: 'idx_event_location_in_work_id', fields: ['location_in_work_id'] },
        ],
    }
);
