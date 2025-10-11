import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import { getAuthorizationHeaderValue } from '../helpers/getAuthorizationHeaderValue.js';
import tokenService from '../services/tokenService.js';
import appUserService from '../services/appUserService.js';

const authMiddleware = async (req, res, next) => {
    try {
        const tokenValue = getAuthorizationHeaderValue(req, res, next);

        let decoded;
        try {
            decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
        } catch (err) {
            const isExpired = err?.name === 'TokenExpiredError';
            res.set(
                'WWW-Authenticate',
                isExpired
                    ? 'Bearer error="invalid_token", error_description="Expired token"'
                    : 'Bearer error="invalid_token", error_description="Invalid token"'
            );
            return next(createHttpError(401, 'Unauthorized'));
        }

        const token = await tokenService.getTokenByTokenValue(tokenValue);
        const appUser = await appUserService.getAppUser(decoded.id);

        if (token == null || token.owner_id !== appUser.id) {
            res.set(
                'WWW-Authenticate',
                'Bearer error="invalid_token", error_description="Revoked or mismatched token"'
            );
            return next(createHttpError(401, 'Unauthorized'));
        }

        req.appUser = appUser;
        req.token = tokenValue;

        return next();
    } catch (err) {
        return next(err);
    }
};

export default authMiddleware;
