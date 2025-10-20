import createHttpError from 'http-errors';

const validateBody = validator => {
    const func = (req, res, next) => {
        const { value, error } = validator.validate(req.body);

        if (error) {
            throw createHttpError(400, error.message);
        }

        req.body = value;

        next();
    };

    return func;
};

export default validateBody;
