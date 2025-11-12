import { Router } from 'express';
import { createMovie, listMovie, getMovie, updateMovie, deleteMovie } from '../controllers/movie.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { publicReadLimiter, adminLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

/**
 * GET /api/movies
 * Get all movies (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/', publicReadLimiter, listMovie);

/**
 * GET /api/movies/:movieId
 * Get a single movie by ID (public)
 * Rate limited: 200 requests per 15 minutes
 */
router.get('/:movieId', publicReadLimiter, getMovie);

/**
 * POST /api/movies
 * Create a new movie (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.post('/', adminLimiter, requireAuth, requireRole('ADMIN'), createMovie);

/**
 * PUT /api/movies/:id
 * Update a movie (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.put('/:id', adminLimiter, requireAuth, requireRole('ADMIN'), updateMovie);

/**
 * DELETE /api/movies/:movieId
 * Delete a movie (Admin only)
 * Rate limited: 50 requests per 15 minutes
 */
router.delete('/:movieId', adminLimiter, requireAuth, requireRole('ADMIN'), deleteMovie);

export default router;
