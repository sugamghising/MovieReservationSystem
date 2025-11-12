import express from "express";
import { requireAuth } from "../middleware/auth.middleware";
import { cancelReservation, createReservation, getReservation, listUserReservation } from "../controllers/reservations.controller";
import { reservationLimiter } from '../middleware/rate-limit.middleware';

const router = express.Router();

/**
 * POST /api/reservations
 * Create a reservation
 * Rate limited: 20 requests per 15 minutes
 */
router.post('/', reservationLimiter, requireAuth, createReservation);

/**
 * PUT /api/reservations/:id
 * Cancel a reservation
 * Rate limited: 20 requests per 15 minutes
 */
router.put('/:id', reservationLimiter, requireAuth, cancelReservation);

/**
 * GET /api/reservations
 * Get user's reservations
 */
router.get('/', requireAuth, listUserReservation);

/**
 * GET /api/reservations/:id
 * Get specific reservation
 */
router.get('/:id', requireAuth, getReservation);

export default router;