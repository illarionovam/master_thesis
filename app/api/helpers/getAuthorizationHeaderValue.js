import createHttpError from 'http-errors';

export const getAuthorizationHeaderValue = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader == null || !authHeader.startsWith('Bearer ')) {
        res.set(
            'WWW-Authenticate',
            'Bearer error="invalid_request", error_description="Missing or malformed Authorization header"'
        );
        return next(createHttpError(401, 'Unauthorized'));
    }

    return authHeader.split(' ')[1];
};
