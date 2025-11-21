import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
});

export const authSlowDown = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 10,
    delayMs: 500,
    maxDelayMs: 5 * 1000,
});

export const generalRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60,
});

export const generationRateLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 5,
});
