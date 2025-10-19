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
        indexes: [
            { name: 'idx_event_participant_event_id', fields: ['event_id'] },
            { name: 'idx_event_participant_character_in_work_id', fields: ['character_in_work_id'] },
            { name: 'uq_event_participant', unique: true, fields: ['event_id', 'character_in_work_id'] },
        ],
    }
);
