import { DataTypes } from 'sequelize';
import { sequelize } from '../db/db.js';
import { normalizeOptionalText } from '../helpers/normalizeOptionalText.js';

export const Work = sequelize.define(
    'work',
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
        title: {
            type: DataTypes.TEXT,
            allowNull: false,
            set(v) {
                this.setDataValue('title', v.trim());
            },
        },
        annotation: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(v) {
                this.setDataValue('annotation', normalizeOptionalText(v));
            },
        },
        synopsis: {
            type: DataTypes.TEXT,
            allowNull: true,
            set(v) {
                this.setDataValue('synopsis', normalizeOptionalText(v));
            },
        },
    },
    {
        tableName: 'work',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',

        indexes: [{ name: 'idx_work_owner_id', fields: ['owner_id'] }],
    }
);
