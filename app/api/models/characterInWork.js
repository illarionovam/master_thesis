import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

export const CharacterInWork = sequelize.define(
    'character_in_work',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
        },
        character_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'character_entity', key: 'id' },
        },
        work_id: {
            type: DataTypes.UUID,
            allowNull: false,
            references: { model: 'work', key: 'id' },
        },
        image_url: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(v) {
                this.setDataValue('image_url', normalizeOptionalText(v));
            },
        },
        attributes: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
            validate: {
                isObject(value) {
                    if (value == null || typeof value !== 'object' || Array.isArray(value)) {
                        throw new Error('Attributes must be a JSON object');
                    }
                },
            },
        },
    },
    {
        tableName: 'character_in_work',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [
            { name: 'idx_character_in_work_work_id', fields: ['work_id'] },
            { name: 'idx_character_in_work_character_id', fields: ['character_id'] },
            { name: 'uq_character_in_work', unique: true, fields: ['character_id', 'work_id'] },
        ],
    }
);
