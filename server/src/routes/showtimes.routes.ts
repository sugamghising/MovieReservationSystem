import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createShowtime, deleteShowtime, getAvailableSeats, getShowtimeByMovies, listShowtimes, updateShowtime } from '../controllers/showtimes.controller';
import { publicReadLimiter, adminLimiter } from '../middleware/rate-limit.middleware';

const router = express.Router();

/**
 * POST /api/showtimes
 * Create a showtime (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.post('/', adminLimiter, requireAuth, requireRole('ADMIN'), createShowtime);

/**
 * GET /api/showtimes
 * Get all showtimes (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/', publicReadLimiter, listShowtimes);

/**
 * GET /api/showtimes/movie/:movieId
 * Get showtimes by movie (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/movie/:movieId', publicReadLimiter, getShowtimeByMovies);

/**
 * GET /api/showtimes/:showtimeId/available-seats
 * Get available seats for showtime (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/:showtimeId/available-seats', publicReadLimiter, getAvailableSeats);

/**
 * PUT /api/showtimes/:showtimeId
 * Update a showtime (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.put('/:showtimeId', adminLimiter, requireAuth, requireRole('ADMIN'), updateShowtime);

/**
 * DELETE /api/showtimes/:showtimeId
 * Delete a showtime (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.delete('/:showtimeId', adminLimiter, requireAuth, requireRole('ADMIN'), deleteShowtime);

export default router;