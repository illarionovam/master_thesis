import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

export const Character = sequelize.define(
    'character_entity',
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
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('name', v.trim());
            },
        },
        appearance: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('appearance', v.trim());
            },
        },
        personality: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('personality', v.trim());
            },
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('bio', v.trim());
            },
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
        },
    },
    {
        tableName: 'character_entity',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [{ name: 'idx_character_entity_owner_id', fields: ['owner_id'] }],
    }
);
