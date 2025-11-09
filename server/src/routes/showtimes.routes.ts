import express from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';
import { createShowtime, listShowtimes } from '../controllers/showtimes.controller';

const router = express.Router();

router.post('/', requireAuth, requireRole('ADMIN'), createShowtime);
router.get('/', listShowtimes);

export default router;