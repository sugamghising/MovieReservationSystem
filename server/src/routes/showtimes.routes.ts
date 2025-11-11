import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createShowtime, deleteShowtime, getAvailableSeats, getShowtimeByMovies, listShowtimes, updateShowtime } from '../controllers/showtimes.controller';

const router = express.Router();

router.post('/', requireAuth, requireRole('ADMIN'), createShowtime);
router.get('/', listShowtimes);
router.get('/movie/:movieId', getShowtimeByMovies);
router.get('/:showtimeId/available-seats', getAvailableSeats);
router.put('/:showtimeId', requireAuth, requireRole('ADMIN'), updateShowtime);
router.delete('/:showtimeId', requireAuth, requireRole('ADMIN'), deleteShowtime);

export default router;