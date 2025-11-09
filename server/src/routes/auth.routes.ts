import { Router } from 'express';
import { login, register } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', register);

/**
 * POST /api/auth/login
 * Login user and get JWT token
 */
router.post('/login', login);

export default router;
