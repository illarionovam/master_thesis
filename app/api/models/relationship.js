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
            set(v) {
                this.setDataValue('type', v.trim());
            },
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
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
    }
);
