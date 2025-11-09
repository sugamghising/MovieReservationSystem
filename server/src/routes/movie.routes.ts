import { Router } from 'express';
import { createMovie, listMovie, getMovie, updateMovie, deleteMovie } from '../controllers/movie.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();

/**
 * GET /api/movies
 * Get all movies (public)
 */
router.get('/', listMovie);

/**
 * GET /api/movies/:movieId
 * Get a single movie by ID (public)
 */
router.get('/:movieId', getMovie);

/**
 * POST /api/movies
 * Create a new movie (Admin only)
 */
router.post('/', requireAuth, requireRole('ADMIN'), createMovie);

/**
 * PUT /api/movies/:id
 * Update a movie (Admin only)
 */
router.put('/:id', requireAuth, requireRole('ADMIN'), updateMovie);

/**
 * DELETE /api/movies/:movieId
 * Delete a movie (Admin only)
 */
router.delete('/:movieId', requireAuth, requireRole('ADMIN'), deleteMovie);

export default router;
