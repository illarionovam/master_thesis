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
            validate: {
                len: {
                    args: [1, 200],
                    msg: 'Name must contain no more than 200 characters',
                },
            },
            set(v) {
                this.setDataValue('name', v?.trim());
            },
        },
        appearance: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 3000],
                    msg: 'Appearance must contain no more than 3000 characters',
                },
            },
            set(v) {
                this.setDataValue('appearance', v?.trim());
            },
        },
        personality: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 3000],
                    msg: 'Personality must contain no more than 3000 characters',
                },
            },
            set(v) {
                this.setDataValue('personality', v?.trim());
            },
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                len: {
                    args: [1, 6000],
                    msg: 'Bio must contain no more than 6000 characters',
                },
            },
            set(v) {
                this.setDataValue('bio', v?.trim());
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
        tableName: 'character_entity',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        indexes: [{ name: 'idx_character_entity_owner_id', fields: ['owner_id'] }],
    }
);
