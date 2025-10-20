import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

export const Relationship = sequelize.define(
    'relationship',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        from_character_in_work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'character_in_work', key: 'id' },
        },
        to_character_in_work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'character_in_work', key: 'id' },
        },
        type: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 120],
                    msg: 'Type must contain no more than 120 characters',
                },
            },
            set(v) {
                this.setDataValue('type', v.trim());
            },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
            validate: {
                len: {
                    args: [1, 500],
                    msg: 'Notes must contain no more than 500 characters',
                },
            },
            set(v) {
                this.setDataValue('notes', normalizeOptionalText(v));
            },
        },
    },
    {
        tableName: 'relationship',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            {
                name: 'uq_relationship_from_to',
                unique: true,
                fields: ['from_character_in_work_id', 'to_character_in_work_id'],
            },
            { name: 'idx_relationship_from', fields: ['from_character_in_work_id'] },
            { name: 'idx_relationship_to', fields: ['to_character_in_work_id'] },
        ],
    }
);
