import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';
import { authLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 * Rate limited: 5 requests per 15 minutes
 */
router.post('/register', authLimiter, register);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 * Rate limited: 5 requests per 15 minutes
 */
router.post('/login', authLimiter, login);

export default router;
