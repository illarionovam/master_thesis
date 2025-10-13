import jwt from 'jsonwebtoken';
import createHttpError from 'http-errors';
import tokenService from '../services/tokenService.js';
import appUserService from '../services/appUserService.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader == null || !authHeader.startsWith('Bearer ')) {
            res.set(
                'WWW-Authenticate',
                'Bearer error="invalid_request", error_description="Missing or malformed Authorization header"'
            );
            return next(createHttpError(401, 'Unauthorized'));
        }

        const tokenValue = authHeader.split(' ')[1];

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

        if (token == null || token.owner_id !== decoded.sub || token.scope !== decoded.scope) {
            res.set(
                'WWW-Authenticate',
                'Bearer error="invalid_token", error_description="Revoked or mismatched token"'
            );
            return next(createHttpError(401, 'Unauthorized'));
        }

        const appUser = await appUserService.getAppUser(decoded.sub);

        if (!appUser.verified && token.scope !== 'email_verify') {
            res.set('WWW-Authenticate', 'Bearer error="insufficient_scope", scope="email_verify"');
            return next(createHttpError(403, 'Unverified email'));
        }

        req.appUser = appUser;
        req.token = token;

        return next();
    } catch (err) {
        return next(err);
    }
};

const requireScope = needed => async (req, res, next) => {
    if (req.token.scope !== needed) {
        res.set(
            'WWW-Authenticate',
            `Bearer error="insufficient_scope", error_description="Token does not have the required scope", scope="${needed}"`
        );
        return next(createHttpError(403, 'Forbidden'));
    }

    return next();
};

export default {
    authMiddleware,
    requireScope,
};
