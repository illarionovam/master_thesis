import { Sequelize } from 'sequelize';
import { constructValidationError } from '../helpers/constructValidationError.js';

export const handleErrors = (err, req, res, next) => {
    if (err instanceof Sequelize.ValidationError) {
        err.status = 400;
        err.message = `Validation failed: ${constructValidationError(err)}`;
    }

    const message = err.message || 'Internal server error';
    res.status(err.status || 500).json({ message });
};
