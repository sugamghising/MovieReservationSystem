import express from 'express';
import { addSeat, createTheatre, listTheatre } from '../controllers/theatres.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = express.Router();

router.post('/', requireAuth, requireRole('ADMIN'), createTheatre);
router.get('/', listTheatre);
router.post('/theatreId/seat', requireAuth, requireRole('ADMIN'), addSeat);

export default router;