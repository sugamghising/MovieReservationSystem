import rateLimit from 'express-rate-limit';

/**
 * General API rate limiter
 * Applies to all API routes unless overridden
 * Allows 100 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again after 15 minutes'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Store in memory (for production, consider Redis)
    skipSuccessfulRequests: false, // Count all requests
    skipFailedRequests: false,
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 * Allows 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login/register attempts per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Moderate rate limiter for reservation/booking endpoints
 * Prevents abuse while allowing legitimate usage
 * Allows 20 requests per 15 minutes per IP
 */
export const reservationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 20 reservation requests per windowMs
    message: {
        success: false,
        message: 'Too many reservation requests, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Payment endpoint rate limiter
 * Strict limits to prevent payment abuse
 * Allows 10 requests per 15 minutes per IP
 */
export const paymentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 payment requests per windowMs
    message: {
        success: false,
        message: 'Too many payment requests, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Admin endpoints rate limiter
 * Moderate limits for admin operations
 * Allows 50 requests per 15 minutes per IP
 */
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 admin requests per windowMs
    message: {
        success: false,
        message: 'Too many admin requests, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Lenient rate limiter for public read endpoints
 * Allows more requests for browsing
 * Allows 200 requests per 15 minutes per IP
 */
export const publicReadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // Limit each IP to 200 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests, please try again after 15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});

/**
 * Very strict rate limiter for webhook endpoints
 * Prevents spam and abuse
 * Allows 100 requests per hour per IP
 */
export const webhookLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 100, // Limit each IP to 100 webhook requests per hour
    message: {
        success: false,
        message: 'Too many webhook requests, please try again later'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false,
});
