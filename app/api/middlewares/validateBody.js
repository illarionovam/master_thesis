import createHttpError from 'http-errors';

const validateBody = validator => {
    const func = (req, res, next) => {
        const { error } = validator.validate(req.body);

        if (error) {
            throw createHttpError(400, error.message);
        }

        next();
    };

    return func;
};

export default validateBody;
