import express from 'express';
import { addSeat, createTheatre, listSeat, listTheatre } from '../controllers/theatres.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { publicReadLimiter, adminLimiter } from '../middleware/rate-limit.middleware';

const router = express.Router();

/**
 * POST /api/theatres
 * Create a theater (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.post('/', adminLimiter, requireAuth, requireRole('ADMIN'), createTheatre);

/**
 * GET /api/theatres
 * Get all theaters (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/', publicReadLimiter, listTheatre);

/**
 * POST /api/theatres/:theatreId/seat
 * Add seat to theater (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.post('/:theatreId/seat', adminLimiter, requireAuth, requireRole('ADMIN'), addSeat);

/**
 * GET /api/theatres/:theatreId/seat
 * List seats in theater (Admin only)
 */
router.get('/:theatreId/seat', requireAuth, requireRole('ADMIN'), listSeat);

export default router;