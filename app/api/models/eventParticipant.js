import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';

export const EventParticipant = sequelize.define(
    'event_participant',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        event_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'event', key: 'id' },
        },
        character_in_work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'character_in_work', key: 'id' },
        },
    },
    {
        tableName: 'event_participant',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }
);
